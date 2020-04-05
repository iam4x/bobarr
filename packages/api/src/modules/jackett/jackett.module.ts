import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';

import { ParamsModule } from 'src/modules/params/params.module';
import { LibraryModule } from 'src/modules/library/library.module';

import { JackettService } from './jackett.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TVSeasonDAO, TVEpisodeDAO]),
    ParamsModule,
    forwardRef(() => LibraryModule),
  ],
  providers: [JackettService],
  exports: [JackettService],
})
export class JackettModule {}
