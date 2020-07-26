import { Module } from '@nestjs/common';

import { RedisService } from './redis.service';
import { ConfigService, ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule],
  providers: [RedisService],
  exports: [RedisService],
})
export class RedisModule {}
