import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { TorrentDAO } from 'src/entities/dao/torrent.dao';

import { TransmissionService } from './transmission.service';
import { TransmissionResolver } from './transmission.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([TorrentDAO])],
  providers: [TransmissionService, TransmissionResolver],
  exports: [TransmissionService],
})
export class TransmissionModule {}
