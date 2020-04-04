import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParameterDAO } from 'src/entities/dao/parameter.dao';

import { ParamsResolver } from './params.resolver';
import { ParamsService } from './params.service';

@Module({
  imports: [TypeOrmModule.forFeature([ParameterDAO])],
  providers: [ParamsResolver, ParamsService],
  exports: [ParamsService],
})
export class ParamsModule {}
