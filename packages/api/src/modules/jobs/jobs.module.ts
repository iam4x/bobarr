import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

import { REDIS_CONFIG } from 'src/config';
import { JobsQueue } from 'src/app.dto';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';
import { FileDAO } from 'src/entities/dao/file.dao';

import { JackettModule } from 'src/modules/jackett/jackett.module';
import { LibraryModule } from 'src/modules/library/library.module';
import { TransmissionModule } from 'src/modules/transmission/transmission.module';
import { TMDBModule } from 'src/modules/tmdb/tmdb.module';
import { ParamsModule } from 'src/modules/params/params.module';

import { DownloadProcessor } from './processors/download.processor';
import { RefreshTorrentProcessor } from './processors/refresh-torrent.processor';
import { OrganizeProcessor } from './processors/organize.processor';
import { ScanLibraryProcessor } from './processors/scan-library.processor';

import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';

const queues = [
  JobsQueue.REFRESH_TORRENT,
  JobsQueue.DOWNLOAD,
  JobsQueue.RENAME_AND_LINK,
  JobsQueue.SCAN_LIBRARY,
].map((name) => ({
  name,
  redis: REDIS_CONFIG,
  defaultJobOptions: { removeOnFail: 100, removeOnComplete: 100 },
}));

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovieDAO,
      TorrentDAO,
      TVSeasonDAO,
      TVEpisodeDAO,
      FileDAO,
    ]),
    BullModule.registerQueue(...queues),
    JackettModule,
    TransmissionModule,
    TMDBModule,
    ParamsModule,
    forwardRef(() => LibraryModule),
  ],
  providers: [
    DownloadProcessor,
    RefreshTorrentProcessor,
    OrganizeProcessor,
    ScanLibraryProcessor,
    JobsService,
    JobsResolver,
  ],
  exports: [JobsService],
})
export class JobsModule {}
