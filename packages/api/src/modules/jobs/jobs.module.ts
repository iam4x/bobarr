import { Module, forwardRef } from "@nestjs/common";
import { BullModule } from "@nestjs/bull";
import { TypeOrmModule } from "@nestjs/typeorm";

import { JobsQueue } from "src/app.dto";

import { MovieDAO } from "src/entities/dao/movie.dao";
import { TorrentDAO } from "src/entities/dao/torrent.dao";
import { TVSeasonDAO } from "src/entities/dao/tvseason.dao";
import { TVEpisodeDAO } from "src/entities/dao/tvepisode.dao";

import { JackettModule } from "src/modules/jackett/jackett.module";
import { LibraryModule } from "src/modules/library/library.module";
import { TransmissionModule } from "src/modules/transmission/transmission.module";
import { TMDBModule } from "src/modules/tmdb/tmdb.module";

import { DownloadProcessor } from "./processors/download.processor";
import { RefreshTorrentProcessor } from "./processors/refresh-torrent.processor";
import { RenameAndLinkProcessor } from "./processors/rename-and-link.processor";
import { ScanLibraryProcessor } from "./processors/scan-library.processor";

import { JobsService } from "./jobs.service";
import { JobsResolver } from "./jobs.resolver";

import { ConfigModule, ConfigService } from "@nestjs/config";

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieDAO, TorrentDAO, TVSeasonDAO, TVEpisodeDAO]),
    BullModule.registerQueueAsync(
      {
        imports: [ConfigModule],
        name: JobsQueue.REFRESH_TORRENT,
        useFactory: async (configService: ConfigService) => ({
          redis: configService.get("redis"),
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: JobsQueue.DOWNLOAD,
        useFactory: async (configService: ConfigService) => ({
          redis: configService.get("redis"),
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: JobsQueue.RENAME_AND_LINK,
        useFactory: async (configService: ConfigService) => ({
          redis: configService.get("redis"),
        }),
        inject: [ConfigService],
      },
      {
        imports: [ConfigModule],
        name: JobsQueue.SCAN_LIBRARY,
        useFactory: async (configService: ConfigService) => ({
          redis: configService.get("redis"),
        }),
        inject: [ConfigService],
      }
    ),
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
