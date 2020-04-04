import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieDAO } from 'src/entities/dao/movie.dao';

import { TMDBModule } from 'src/modules/tmdb/tmdb.module';
import { JobsModule } from 'src/modules/jobs/jobs.module';
import { TransmissionModule } from 'src/modules/transmission/transmission.module';

import { LibraryResolver } from './library.resolver';
import { LibraryService } from './library.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovieDAO]),
    TMDBModule,
    TransmissionModule,
    forwardRef(() => JobsModule),
  ],
  providers: [LibraryResolver, LibraryService],
  exports: [LibraryService],
})
export class LibraryModule {}
