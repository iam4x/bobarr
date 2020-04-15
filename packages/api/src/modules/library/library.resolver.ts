import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { UseInterceptors } from '@nestjs/common';

import { GraphQLCommonResponse } from 'src/app.dto';

import { makeInvalidateCacheInterceptor } from 'src/modules/redis/invalidate-cache.interceptor';
import { CacheKeys } from 'src/modules/redis/cache.dto';

import { Movie } from 'src/entities/movie.entity';
import { TVShow } from 'src/entities/tvshow.entity';

import { LibraryService } from './library.service';

import {
  EnrichedMovie,
  EnrichedTVShow,
  DownloadingMedia,
  EnrichedTVEpisode,
  JackettInput,
} from './library.dto';

@Resolver()
export class LibraryResolver {
  public constructor(private readonly libraryService: LibraryService) {}

  @Query((_returns) => [DownloadingMedia])
  public getDownloadingMedias() {
    return this.libraryService.getDownloadingMedias();
  }

  @Query((_returns) => [EnrichedMovie])
  public getMovies() {
    return this.libraryService.getMovies();
  }

  @Query((_returns) => [EnrichedTVShow])
  public getTVShows() {
    return this.libraryService.getTVShows();
  }

  @Query((_returns) => [EnrichedTVEpisode])
  public getMissingTVEpisodes() {
    return this.libraryService.findMissingTVEpisodes();
  }

  @Query((_returns) => [EnrichedMovie])
  public getMissingMovies() {
    return this.libraryService.findMissingMovies();
  }

  @Mutation((_returns) => GraphQLCommonResponse)
  public async downloadMovie(
    @Args('movieId', { type: () => Int }) movieId: number,
    @Args('jackettResult', { type: () => JackettInput })
    jackettResult: JackettInput
  ) {
    await this.libraryService.downloadMovie(movieId, jackettResult);
    return { success: true, message: 'MOVIE_DOWNLOAD_STARTED' };
  }

  @Mutation((_returns) => GraphQLCommonResponse)
  public async downloadTVEpisode(
    @Args('episodeId', { type: () => Int }) episodeId: number,
    @Args('jackettResult', { type: () => JackettInput })
    jackettResult: JackettInput
  ) {
    await this.libraryService.downloadTVEpisode(episodeId, jackettResult);
    return { success: true, message: 'TV_EPISODE_DOWNLOAD_STARTED' };
  }

  @UseInterceptors(
    makeInvalidateCacheInterceptor([CacheKeys.RECOMMENDED_MOVIES])
  )
  @Mutation((_returns) => Movie, { name: 'trackMovie' })
  public trackMovie(
    @Args('title') title: string,
    @Args('tmdbId', { type: () => Int }) tmdbId: number
  ) {
    return this.libraryService.trackMovie({ title, tmdbId });
  }

  @UseInterceptors(
    makeInvalidateCacheInterceptor([CacheKeys.RECOMMENDED_MOVIES])
  )
  @Mutation((_returns) => GraphQLCommonResponse)
  public async removeMovie(
    @Args('tmdbId', { type: () => Int }) tmdbId: number
  ) {
    await this.libraryService.removeMovie(tmdbId);
    return { success: true, message: 'MOVIE_REMOVED_FROM_LIBRARY' };
  }

  @UseInterceptors(
    makeInvalidateCacheInterceptor([CacheKeys.RECOMMENDED_TV_SHOWS])
  )
  @Mutation((_returns) => TVShow)
  public trackTVShow(
    @Args('tmdbId', { type: () => Int }) tmdbId: number,
    @Args('seasonNumbers', { type: () => [Int] }) seasonNumbers: number[]
  ) {
    return this.libraryService.trackTVShow({ tmdbId, seasonNumbers });
  }

  @UseInterceptors(
    makeInvalidateCacheInterceptor([CacheKeys.RECOMMENDED_TV_SHOWS])
  )
  @Mutation((_returns) => GraphQLCommonResponse)
  public async removeTVShow(
    @Args('tmdbId', { type: () => Int }) tmdbId: number
  ) {
    await this.libraryService.removeTVShow(tmdbId);
    return { success: true, message: 'TVSHOW_REMOVED_FROM_LIBRARY' };
  }
}
