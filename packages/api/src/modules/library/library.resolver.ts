import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { GraphQLCommonResponse } from 'src/app.dto';
import { Movie } from 'src/entities/movie.entity';
import { TVShow } from 'src/entities/tvshow.entity';

import { LibraryService } from './library.service';
import { EnrichedMovie, EnrichedTVShow } from './library.dto';

@Resolver()
export class LibraryResolver {
  public constructor(private readonly libraryService: LibraryService) {}

  @Query((_returns) => [EnrichedMovie])
  public getMovies() {
    return this.libraryService.getMovies();
  }

  @Query((_returns) => [EnrichedTVShow])
  public getTVShows() {
    return this.libraryService.getTVShows();
  }

  @Mutation((_returns) => Movie, { name: 'trackMovie' })
  public trackMovie(
    @Args('title') title: string,
    @Args('tmdbId', { type: () => Int }) tmdbId: number
  ) {
    return this.libraryService.trackMovie({ title, tmdbId });
  }

  @Mutation((_returns) => GraphQLCommonResponse)
  public async removeMovie(
    @Args('tmdbId', { type: () => Int }) tmdbId: number
  ) {
    await this.libraryService.removeMovie(tmdbId);
    return { success: true, message: 'MOVIE_REMOVED_FROM_LIBRARY' };
  }

  @Mutation((_returns) => TVShow)
  public trackTVShow(
    @Args('tmdbId', { type: () => Int }) tmdbId: number,
    @Args('seasonNumbers', { type: () => [Int] }) seasonNumbers: number[]
  ) {
    return this.libraryService.trackTVShow({ tmdbId, seasonNumbers });
  }

  @Mutation((_returns) => GraphQLCommonResponse)
  public async removeTVShow(
    @Args('tmdbId', { type: () => Int }) tmdbId: number
  ) {
    await this.libraryService.removeTVShow(tmdbId);
    return { success: true, message: 'TVSHOW_REMOVED_FROM_LIBRARY' };
  }
}
