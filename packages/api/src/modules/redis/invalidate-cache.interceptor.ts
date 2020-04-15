import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  mixin,
} from '@nestjs/common';

import { tap } from 'rxjs/operators';

import { RedisService } from './redis.service';
import { CacheKeys } from './cache.interceptor';

@Injectable()
export abstract class CacheInterceptor implements NestInterceptor {
  protected abstract readonly keys: CacheKeys[];

  public constructor(private readonly redisService: RedisService) {}

  public intercept(_context: ExecutionContext, next: CallHandler) {
    return next
      .handle()
      .pipe(
        tap(() =>
          Promise.all(
            this.keys.map((key) => this.redisService.deleteKeysPattern(key))
          )
        )
      );
  }
}

export const makeInvalidateCacheInterceptor = (keys: CacheKeys[]) =>
  mixin(
    class extends CacheInterceptor {
      protected readonly keys = keys;
    }
  );
