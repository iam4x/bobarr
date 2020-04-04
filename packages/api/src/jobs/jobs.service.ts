import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { setQueues } from 'bull-board';

import { JobsQueue } from 'src/app.dto';

@Injectable()
export class JobsService {
  public constructor(
    @InjectQueue(JobsQueue.DOWNLOAD) private readonly downloadQueue: Queue
  ) {
    setQueues([downloadQueue]);
  }

  public startDownloadMovie(movieId: number) {
    return this.downloadQueue.add('movie', movieId);
  }
}
