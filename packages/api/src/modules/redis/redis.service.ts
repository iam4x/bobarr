import Redis from 'ioredis';
import { Injectable, Inject } from '@nestjs/common';
import { forEach } from 'p-iteration';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { CacheKeys } from './cache.dto';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class RedisService {
  private client: Redis.Redis;

  public constructor(
      @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
      private readonly configService: ConfigService,
  ) {
    this.logger = logger.child({ context: 'RedisService' });
    this.client = new Redis({
      db: 0,
      host: this.configService.get('redis.host'),
      port: this.configService.get('redis.port'),
      password: this.configService.get('redis.password'),
    });
  }

  public clearCache() {
    if (this.configService.get('redis.debug', false)) this.logger.info('clear cache');
    return forEach(Object.entries(CacheKeys), ([, value]) =>
      this.deleteKeysPattern(value)
    );
  }

  public get(key: string) {
    if (this.configService.get('redis.debug', false)) this.logger.info('get key', { key });
    return this.client.get(key);
  }

  public set(key: string, data: string, ttl: number) {
    if (this.configService.get('redis.debug', false)) this.logger.info('set key', { key });
    return this.client.set(key, data, 'PX', ttl);
  }

  public async deleteKeysPattern(key: CacheKeys) {
    if (this.configService.get('redis.debug', false)) this.logger.info('delete key', { key });
    const keys = await this.client.keys(`${key}*`);
    await Promise.all(keys.map((_) => this.client.del(_)));
  }
}
