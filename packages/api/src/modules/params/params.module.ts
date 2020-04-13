import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParameterDAO } from 'src/entities/dao/parameter.dao';
import { QualityDAO } from 'src/entities/dao/quality.dao';
import { TagDAO } from 'src/entities/dao/tag.dao';

import { ParamsResolver } from './params.resolver';
import { ParamsService } from './params.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParameterDAO, QualityDAO, TagDAO])],
  providers: [ParamsResolver, ParamsService],
  exports: [ParamsService],
})
export class ParamsModule {}
