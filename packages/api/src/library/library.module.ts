import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TMDBModule } from 'src/tmdb/tmdb.module';
import { JobsModule } from 'src/jobs/jobs.module';
import { MovieDAO } from 'src/entities/dao/movie.dao';

import { LibraryResolver } from './library.resolver';
import { LibraryService } from './library.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieDAO]),
    TMDBModule,
    forwardRef(() => JobsModule),
  ],
  providers: [LibraryResolver, LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
