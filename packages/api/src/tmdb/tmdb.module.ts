import { Module } from '@nestjs/common';

import { ParamsModule } from 'src/params/params.module';

import { TMDBResolver } from './tmdb.resolver';
import { TMDBService } from './tmdb.service';

@Module({
  imports: [ParamsModule],
  providers: [TMDBResolver, TMDBService],
  exports: [TMDBService],
})
export class TMDBModule {}
