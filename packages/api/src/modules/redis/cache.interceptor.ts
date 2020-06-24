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
import { CacheKeys } from './cache.dto';

export function CacheMethod<TValue = any>({
  key,
  ttl,
}: {
  key: CacheKeys;
  ttl: number;
}) {
  return function (
    _target: Record<string, any>,
    _propertyKey: string,
    descriptor: PropertyDescriptor
  ) {
    const method = descriptor.value;

    // eslint-disable-next-line no-param-reassign
    descriptor.value = async function (...args: any[]) {
      const computedCacheKey = `${key}_${
        args.length ? args.map((arg) => JSON.stringify(arg)) : 'no_args'
      }`;

      const cachedResult = await (this as any).redisService.get(
        computedCacheKey
      );

      if (cachedResult) return JSON.parse(cachedResult);

      const result = await method.apply(this, args);
      await (this as any).redisService.set(
        computedCacheKey,
        JSON.stringify(result),
        ttl
      );

      return result;
    };
  };
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
