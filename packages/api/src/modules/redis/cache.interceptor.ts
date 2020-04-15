import {
  ExecutionContext,
  Injectable,
  mixin,
  NestInterceptor,
  CallHandler,
} from '@nestjs/common';

import { of } from 'rxjs';
import { map } from 'rxjs/operators';

import { RedisService } from './redis.service';

export enum CacheKeys {
  RECOMMENDED_TV_SHOWS = 'recommended_tv_shows',
}

@Injectable()
export abstract class CacheInterceptor implements NestInterceptor {
  protected abstract readonly ttl: number;
  protected abstract readonly key: CacheKeys;

  public constructor(private readonly redisService: RedisService) {}

  public async intercept(context: ExecutionContext, next: CallHandler) {
    const [, params] = context.getArgs();
    const key = `${this.key}_${JSON.stringify(params)}`;

    const cachedResult = await this.redisService.get(key);
    if (cachedResult) return of(JSON.parse(cachedResult));

    return next.handle().pipe(
      map((data) => {
        this.redisService.set(key, JSON.stringify(data), this.ttl);
        return data;
      })
    );
  }
}

export const makeCacheInterceptor = ({
  key,
  ttl,
}: {
  key: CacheKeys;
  ttl: number;
}) =>
  mixin(
    class extends CacheInterceptor {
      protected readonly ttl = ttl;
      protected readonly key = key;
    }
  );
