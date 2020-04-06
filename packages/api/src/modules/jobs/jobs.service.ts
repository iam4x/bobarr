import { Injectable, Inject } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { setQueues } from 'bull-board';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { JobsQueue, DownloadQueueProcessors } from 'src/app.dto';

@Injectable()
export class JobsService {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectQueue(JobsQueue.DOWNLOAD)
    private readonly downloadQueue: Queue,
    @InjectQueue(JobsQueue.RENAME_AND_LINK)
    private readonly renameAndLinkQueue: Queue,
    @InjectQueue(JobsQueue.REFRESH_TORRENT)
    private readonly refreshTorrentQueue: Queue
  ) {
    this.logger = this.logger.child({ context: 'JobsService' });

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
    this.logger.info('add download movie job', { movieId });
    return this.downloadQueue.add(
      DownloadQueueProcessors.DOWNLOAD_MOVIE,
      movieId
    );
  }

  public startDownloadSeason(seasonId: number) {
    this.logger.info('add download season job', { seasonId });
    return this.downloadQueue.add(
      DownloadQueueProcessors.DOWNLOAD_SEASON,
      seasonId
    );
  }
}
