import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

import { REDIS_CONFIG } from 'src/config';
import { JobsQueue } from 'src/app.dto';

import { JackettModule } from 'src/jackett/jackett.module';
import { MovieDAO } from 'src/entities/dao/movie.dao';
import { LibraryModule } from 'src/library/library.module';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';

import { JobsService } from './jobs.service';
import { DownloadProcessor } from './download.processor';
import { TransmissionModule } from 'src/transmission/transmission.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieDAO, TorrentDAO]),
    BullModule.registerQueue({
      name: JobsQueue.DOWNLOAD,
      redis: REDIS_CONFIG,
    }),
    JackettModule,
    TransmissionModule,
    forwardRef(() => LibraryModule),
  ],
  providers: [DownloadProcessor, JobsService],
  exports: [JobsService],
})
export class JobsModule {}
