import { forEachSeries } from 'p-iteration';
import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';

import {
  JobsQueue,
  DownloadableMediaState,
  FileType,
  RenameAndLinkQueueProcessors,
} from 'src/app.dto';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';

import { TransmissionService } from 'src/modules/transmission/transmission.service';

@Processor(JobsQueue.REFRESH_TORRENT)
export class RefreshTorrentProcessor {
  public constructor(
    @InjectQueue(JobsQueue.RENAME_AND_LINK)
    private readonly renameAndLinkQueue: Queue,
    private readonly movieDAO: MovieDAO,
    private readonly torrentDAO: TorrentDAO,
    private readonly transmissionService: TransmissionService
  ) {}

  @Process()
  public async refreshTorrents() {
    const donwloadingMovies = await this.movieDAO.find({
      where: { state: DownloadableMediaState.DOWNLOADING },
    });

    await forEachSeries(donwloadingMovies, async (movie) => {
      const torrent = await this.torrentDAO.findOneOrFail({
        where: { resourceId: movie.id, resourceType: FileType.MOVIE },
      });

      const transmissionTorrent = await this.transmissionService.getTorrent(
        torrent.torrentHash
      );

      if (transmissionTorrent.percentDone === 1) {
        await this.movieDAO.save({
          id: movie.id,
          state: DownloadableMediaState.DOWNLOADED,
        });
        await this.renameAndLinkQueue.add(
          RenameAndLinkQueueProcessors.HANDLE_MOVIE,
          { movieId: movie.id }
        );
      }
    });
  }
}
