import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TMDBModule } from 'src/tmdb/tmdb.module';
import { MovieDAO } from 'src/entities/dao/movie.dao';

import { LibraryResolver } from './library.resolver';
import { LibraryService } from './library.service';

@Module({
  imports: [TypeOrmModule.forFeature([MovieDAO]), TMDBModule],
  providers: [LibraryResolver, LibraryService],
})
export class LibraryModule {}
