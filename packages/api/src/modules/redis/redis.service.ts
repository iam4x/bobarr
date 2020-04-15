import Redis from 'ioredis';
import { Injectable } from '@nestjs/common';

import { REDIS_CONFIG } from 'src/config';
import { CacheKeys } from './cache.interceptor';

@Injectable()
export class RedisService {
  private client: Redis.Redis;

  public constructor() {
    this.client = new Redis({
      db: 0,
      host: REDIS_CONFIG.host,
      port: REDIS_CONFIG.port,
      password: REDIS_CONFIG.password,
    });
  }

  public get(key: string) {
    if (this.client) return this.client.get(key);
    return undefined;
  }

  public set(key: string, data: string, ttl: number) {
    if (this.client) return this.client.set(key, data, 'PX', ttl);
    return undefined;
  }

  public async deleteKeysPattern(key: CacheKeys) {
    if (this.client) {
      const keys = await this.client.keys(`${key}*`);
      await Promise.all(keys.map((_) => this.client.del(_)));
    }
  }
}
