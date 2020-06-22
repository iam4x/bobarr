import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { RedisModule } from 'src/modules/redis/redis.module';

import { ParameterDAO } from 'src/entities/dao/parameter.dao';
import { QualityDAO } from 'src/entities/dao/quality.dao';
import { TagDAO } from 'src/entities/dao/tag.dao';

import { ParamsResolver } from './params.resolver';
import { ParamsService } from './params.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([ParameterDAO, QualityDAO, TagDAO]),
    RedisModule,
  ],
  providers: [ParamsResolver, ParamsService],
  exports: [ParamsService],
})
export class ParamsModule {}
