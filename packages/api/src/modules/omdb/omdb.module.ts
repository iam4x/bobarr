import { Module } from '@nestjs/common';
import { OMDBService } from './omdb.service';
import { OMDBResolver } from './omdb.resolver';

@Module({
  providers: [OMDBResolver, OMDBService],
  exports: [OMDBService],
})
export class OMDBModule {}
