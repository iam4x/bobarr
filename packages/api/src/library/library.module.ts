import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { MovieDAO } from 'src/entities/dao/movie.dao';

import { LibraryResolver } from './library.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([MovieDAO])],
  providers: [LibraryResolver],
})
export class LibraryModule {}
