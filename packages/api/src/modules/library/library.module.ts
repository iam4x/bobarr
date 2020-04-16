import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TVShowDAO } from 'src/entities/dao/tvshow.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';
import { MediaViewDAO } from 'src/entities/dao/media-view.dao';

import { TMDBModule } from 'src/modules/tmdb/tmdb.module';
import { JobsModule } from 'src/modules/jobs/jobs.module';
import { TransmissionModule } from 'src/modules/transmission/transmission.module';
import { RedisModule } from 'src/modules/redis/redis.module';

import { LibraryResolver } from './library.resolver';
import { LibraryService } from './library.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      MovieDAO,
      TVShowDAO,
      TVSeasonDAO,
      TVEpisodeDAO,
      TorrentDAO,
      MediaViewDAO,
    ]),
    TMDBModule,
    TransmissionModule,
    RedisModule,
    forwardRef(() => JobsModule),
  ],
  providers: [LibraryResolver, LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
