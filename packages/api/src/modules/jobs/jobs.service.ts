import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { setQueues } from 'bull-board';

import { JobsQueue, DownloadQueueProcessors } from 'src/app.dto';

@Injectable()
export class JobsService {
  public constructor(
    @InjectQueue(JobsQueue.DOWNLOAD)
    private readonly downloadQueue: Queue,
    @InjectQueue(JobsQueue.RENAME_AND_LINK)
    private readonly renameAndLinkQueue: Queue,
    @InjectQueue(JobsQueue.REFRESH_TORRENT)
    private readonly refreshTorrentQueue: Queue
  ) {
    setQueues([
      this.downloadQueue,
      this.refreshTorrentQueue,
      this.renameAndLinkQueue,
    ]);

    this.startRecurringJobs();
  }

  private async startRecurringJobs() {
    // start refresh torrents recurring job
    if ((await this.refreshTorrentQueue.getDelayedCount()) === 0) {
      this.refreshTorrentQueue.add(
        {},
        {
          repeat: {
            cron: '*/1 * * * *', // every minute
            startDate: new Date(),
          },
        }
      );
    }
  }

  public startDownloadMovie(movieId: number) {
    return this.downloadQueue.add(
      DownloadQueueProcessors.DOWNLOAD_MOVIE,
      movieId
    );
  }

  public startDownloadSeason(seasonId: number) {
    return this.downloadQueue.add(
      DownloadQueueProcessors.DOWNLOAD_SEASON,
      seasonId
    );
  }
}
