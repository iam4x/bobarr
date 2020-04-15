import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from 'src/modules/redis/redis.module';
import { ParamsModule } from 'src/modules/params/params.module';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVShowDAO } from 'src/entities/dao/tvshow.dao';
import { MovieDAO } from 'src/entities/dao/movie.dao';

import { TMDBResolver } from './tmdb.resolver';
import { TMDBService } from './tmdb.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TVSeasonDAO, TVShowDAO, MovieDAO]),
    ParamsModule,
    RedisModule,
  ],
  providers: [TMDBResolver, TMDBService],
  exports: [TMDBService],
})
export class TMDBModule {}
