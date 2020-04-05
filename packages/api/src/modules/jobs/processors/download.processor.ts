import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import {
  JobsQueue,
  FileType,
  DownloadableMediaState,
  DownloadQueueProcessors,
} from 'src/app.dto';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';

import { JackettService } from 'src/modules/jackett/jackett.service';
import { TransmissionService } from 'src/modules/transmission/transmission.service';

@Processor(JobsQueue.DOWNLOAD)
export class DownloadProcessor {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly jackettService: JackettService,
    private readonly transmissionService: TransmissionService
  ) {}

  @Process(DownloadQueueProcessors.DOWNLOAD_MOVIE)
  public async downloadMovie({ data: movieId }: Job<number>) {
    const [bestResult] = await this.jackettService.searchMovie(movieId);

    if (bestResult === undefined) {
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
    const [bestResult] = await this.jackettService.searchSeason(seasonId);

    if (bestResult === undefined) {
      throw new Error('CANT_FIND_TORRENT');
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
}
