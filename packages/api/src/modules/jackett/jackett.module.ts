import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ParamsModule } from 'src/modules/params/params.module';
import { LibraryModule } from 'src/modules/library/library.module';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';

import { JackettService } from './jackett.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([TVSeasonDAO]),
    ParamsModule,
    forwardRef(() => LibraryModule),
  ],
  providers: [JackettService],
  exports: [JackettService],
})
export class JackettModule {}
