import { Processor, Process } from '@nestjs/bull';
import { Job } from 'bull';

import { JobsQueue, FileType, DownloadableMediaState } from 'src/app.dto';
import { MovieDAO } from 'src/entities/dao/movie.dao';
import { JackettService } from 'src/jackett/jackett.service';
import { LibraryService } from 'src/library/library.service';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';
import { TransmissionService } from 'src/transmission/transmission.service';

@Processor(JobsQueue.DOWNLOAD)
export class DownloadProcessor {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly torrentDAO: TorrentDAO,
    private readonly libraryService: LibraryService,
    private readonly jackettService: JackettService,
    private readonly transmissionService: TransmissionService
  ) {}

  @Process('movie')
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
    });

    await this.movieDAO.save({
      id: movieId,
      state: DownloadableMediaState.DOWNLOADING,
    });

    return torrent;
  }
}
