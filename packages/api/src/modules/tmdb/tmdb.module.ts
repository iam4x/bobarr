import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParamsModule } from 'src/modules/params/params.module';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';

import { TMDBResolver } from './tmdb.resolver';
import { TMDBService } from './tmdb.service';

@Module({
  imports: [TypeOrmModule.forFeature([TVSeasonDAO]), ParamsModule],
  providers: [TMDBResolver, TMDBService],
  exports: [TMDBService],
})
export class TMDBModule {}
