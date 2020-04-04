import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import {
  JobsQueue,
  FileType,
  DownloadableMediaState,
  DownloadQueueProcessors,
} from 'src/app.dto';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';

import { JackettService } from 'src/modules/jackett/jackett.service';
import { TransmissionService } from 'src/modules/transmission/transmission.service';

@Processor(JobsQueue.DOWNLOAD)
export class DownloadProcessor {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly torrentDAO: TorrentDAO,
    private readonly jackettService: JackettService,
    private readonly transmissionService: TransmissionService
  ) {}

  @Process(DownloadQueueProcessors.DOWNLOAD_MOVIE)
  public async downloadMovie({ data: movieId }: Job<number>) {
    const [bestResult] = await this.jackettService.searchMovie(movieId);

    if (bestResult === undefined) {
      throw new Error('CANT_FIND_TORRENT');
    }

    const transmissionTorrent = await this.transmissionService.addTorrentURL(
      bestResult.downloadLink
    );

    const torrent = await this.torrentDAO.save({
      torrentHash: transmissionTorrent.hashString,
      resourceType: FileType.MOVIE,
      resourceId: movieId,
      quality: bestResult.quality.label,
      tag: bestResult.tag.label,
    });

    await this.movieDAO.save({
      id: movieId,
      state: DownloadableMediaState.DOWNLOADING,
    });

    return torrent;
  }
}
