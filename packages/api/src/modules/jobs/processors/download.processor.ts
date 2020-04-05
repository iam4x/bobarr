import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { forEachSeries } from 'p-iteration';
import { Job, Queue } from 'bull';

import {
  JobsQueue,
  FileType,
  DownloadableMediaState,
  DownloadQueueProcessors,
} from 'src/app.dto';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';

import { JackettService } from 'src/modules/jackett/jackett.service';
import { TransmissionService } from 'src/modules/transmission/transmission.service';

@Processor(JobsQueue.DOWNLOAD)
export class DownloadProcessor {
  // eslint-disable-next-line max-params
  public constructor(
    @InjectQueue(JobsQueue.DOWNLOAD) private readonly downloadQueue: Queue,
    private readonly movieDAO: MovieDAO,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly tvEpisodeDAO: TVEpisodeDAO,
    private readonly jackettService: JackettService,
    private readonly transmissionService: TransmissionService
  ) {}

  @Process(DownloadQueueProcessors.DOWNLOAD_MOVIE)
  public async downloadMovie({ data: movieId }: Job<number>) {
    const [bestResult] = await this.jackettService.searchMovie(movieId);
    console.log({ bestResult });

    if (bestResult === undefined) {
      // TODO: auto-retry job in a day
      throw new Error('CANT_FIND_TORRENT');
    }

    const torrent = await this.transmissionService.addTorrentURL(
      bestResult.downloadLink,
      {
        resourceType: FileType.MOVIE,
        resourceId: movieId,
        quality: bestResult.quality.label,
        tag: bestResult.tag.label,
      }
    );

    await this.movieDAO.save({
      id: movieId,
      state: DownloadableMediaState.DOWNLOADING,
    });

    return torrent;
  }

  @Process(DownloadQueueProcessors.DOWNLOAD_SEASON)
  public async downloadSeason({ data: seasonId }: Job<number>) {
    const season = await this.tvSeasonDAO.findOneOrFail({
      where: { id: seasonId },
      relations: ['episodes'],
    });

    const [bestResult] = await this.jackettService.searchSeason(season.id);
    console.log({ bestResult });

    if (bestResult === undefined) {
      return forEachSeries(season.episodes, (episode) =>
        this.downloadQueue.add(
          DownloadQueueProcessors.DOWNLOAD_EPISODE,
          episode.id
        )
      );
    }

    const torrent = await this.transmissionService.addTorrentURL(
      bestResult.downloadLink,
      {
        resourceType: FileType.SEASON,
        resourceId: seasonId,
        quality: bestResult.quality.label,
        tag: bestResult.tag.label,
      }
    );

    await this.tvSeasonDAO.save({
      id: seasonId,
      state: DownloadableMediaState.DOWNLOADING,
    });

    return torrent;
  }

  @Process(DownloadQueueProcessors.DOWNLOAD_EPISODE)
  public async downloadEpisode({ data: episodeId }: Job<number>) {
    const [bestResult] = await this.jackettService.searchEpisode(episodeId);
    console.log({ bestResult });

    if (bestResult === undefined) {
      // TODO: auto-retry job in a day
      throw new Error('TORRENT_NOT_FOUND');
    }

    const torrent = await this.transmissionService.addTorrentURL(
      bestResult.downloadLink,
      {
        resourceType: FileType.EPISODE,
        resourceId: episodeId,
        quality: bestResult.quality.label,
        tag: bestResult.tag.label,
      }
    );

    await this.tvEpisodeDAO.save({
      id: episodeId,
      state: DownloadableMediaState.DOWNLOADING,
    });

    return torrent;
  }
}
