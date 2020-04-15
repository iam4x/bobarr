import { Resolver, Args, Query, Int } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';

import { makeCacheInterceptor } from 'src/modules/redis/cache.interceptor';
import { CacheKeys } from 'src/modules/redis/cache.dto';

import { TMDBService } from './tmdb.service';

import {
  TMDBSearchResults,
  TMDBFormattedTVSeason,
  TMDBSearchResult,
} from './tmdb.dto';

@Resolver()
export class TMDBResolver {
  public constructor(private readonly tmdbService: TMDBService) {}

  @Query((_returns) => TMDBSearchResults)
  public search(@Args('query') query: string) {
    return this.tmdbService.search(query);
  }

  @Query((_returns) => TMDBSearchResults)
  public getPopular() {
    return this.tmdbService.getPopular();
  }

  @Query((_returns) => [TMDBFormattedTVSeason])
  public getTVShowSeasons(
    @Args('tvShowTMDBId', { type: () => Int }) tmdbId: number
  ) {
    return this.tmdbService.getTVShowSeasons(tmdbId);
  }

  @UseInterceptors(
    makeCacheInterceptor({
      key: CacheKeys.RECOMMENDED_TV_SHOWS,
      ttl: 1000 * 60 * 60 * 6, // cache for 30 minutes
    })
  )
  @Query((_returns) => [TMDBSearchResult])
  public getRecommendedTVShows() {
    return this.tmdbService.getRecommended('tvshow');
  }

  @UseInterceptors(
    makeCacheInterceptor({
      key: CacheKeys.RECOMMENDED_MOVIES,
      ttl: 1000 * 60 * 60 * 6, // cache for 30 minutes
    })
  )
  @Query((_returns) => [TMDBSearchResult])
  public getRecommendedMovies() {
    return this.tmdbService.getRecommended('movie');
  }
}
