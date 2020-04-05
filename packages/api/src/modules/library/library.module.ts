import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TVShowDAO } from 'src/entities/dao/tvshow.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';

import { TMDBModule } from 'src/modules/tmdb/tmdb.module';
import { JobsModule } from 'src/modules/jobs/jobs.module';
import { TransmissionModule } from 'src/modules/transmission/transmission.module';

import { LibraryResolver } from './library.resolver';
import { LibraryService } from './library.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieDAO, TVShowDAO, TVSeasonDAO, TVEpisodeDAO]),
    TMDBModule,
    TransmissionModule,
    forwardRef(() => JobsModule),
  ],
  providers: [LibraryResolver, LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
