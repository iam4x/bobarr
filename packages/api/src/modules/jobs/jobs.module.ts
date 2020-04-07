import { Module, forwardRef } from '@nestjs/common';
import { BullModule } from '@nestjs/bull';
import { TypeOrmModule } from '@nestjs/typeorm';

import { REDIS_CONFIG } from 'src/config';
import { JobsQueue } from 'src/app.dto';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';

import { JackettModule } from 'src/modules/jackett/jackett.module';
import { LibraryModule } from 'src/modules/library/library.module';
import { TransmissionModule } from 'src/modules/transmission/transmission.module';
import { TMDBModule } from 'src/modules/tmdb/tmdb.module';

import { DownloadProcessor } from './processors/download.processor';
import { RefreshTorrentProcessor } from './processors/refresh-torrent.processor';
import { RenameAndLinkProcessor } from './processors/rename-and-link.processor';
import { ScanLibraryProcessor } from './processors/scan-library.processor';

import { JobsService } from './jobs.service';
import { JobsResolver } from './jobs.resolver';

const queues = [
  { name: JobsQueue.REFRESH_TORRENT, redis: REDIS_CONFIG },
  { name: JobsQueue.DOWNLOAD, redis: REDIS_CONFIG },
  { name: JobsQueue.RENAME_AND_LINK, redis: REDIS_CONFIG },
  { name: JobsQueue.SCAN_LIBRARY, redis: REDIS_CONFIG },
];

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieDAO, TorrentDAO, TVSeasonDAO, TVEpisodeDAO]),
    BullModule.registerQueue(...queues),
    JackettModule,
    TransmissionModule,
    TMDBModule,
    forwardRef(() => LibraryModule),
  ],
  providers: [
    DownloadProcessor,
    RefreshTorrentProcessor,
    RenameAndLinkProcessor,
    ScanLibraryProcessor,
    JobsService,
    JobsResolver,
  ],
  exports: [JobsService],
})
export class JobsModule {}
