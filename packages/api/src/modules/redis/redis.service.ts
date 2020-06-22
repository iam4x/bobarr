import Redis from 'ioredis';
import { Injectable, Inject } from '@nestjs/common';
import { forEach } from 'p-iteration';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { REDIS_CONFIG, DEBUG_REDIS } from 'src/config';
import { CacheKeys } from './cache.dto';

@Injectable()
export class RedisService {
  private client: Redis.Redis;

  public constructor(@Inject(WINSTON_MODULE_PROVIDER) private logger: Logger) {
    this.logger = logger.child({ context: 'RedisService' });
    this.client = new Redis({
      db: 0,
      host: REDIS_CONFIG.host,
      port: REDIS_CONFIG.port,
      password: REDIS_CONFIG.password,
    });

    // clear cache when api starts
    this.clearCache();
  }

  private clearCache() {
    if (DEBUG_REDIS) this.logger.info('clear cache');
    return forEach(Object.entries(CacheKeys), ([, value]) =>
      this.deleteKeysPattern(value)
    );
  }

  public get(key: string) {
    if (DEBUG_REDIS) this.logger.info('get key', { key });
    return this.client.get(key);
  }

  public set(key: string, data: string, ttl: number) {
    if (DEBUG_REDIS) this.logger.info('set key', { key });
    return this.client.set(key, data, 'PX', ttl);
  }

  public async deleteKeysPattern(key: CacheKeys) {
    if (DEBUG_REDIS) this.logger.info('delete key', { key });
    const keys = await this.client.keys(`${key}*`);
    await Promise.all(keys.map((_) => this.client.del(_)));
  }
}
