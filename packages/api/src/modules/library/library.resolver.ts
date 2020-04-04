import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { Movie } from 'src/entities/movie.entity';

import { LibraryService } from './library.service';
import { EnrichedMovie } from './library.dto';
import { GraphQLCommonResponse } from 'src/app.dto';

@Resolver()
export class LibraryResolver {
  public constructor(private readonly libraryService: LibraryService) {}

  @Query((_returns) => [EnrichedMovie])
  public getMovies() {
    return this.libraryService.getMovies();
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
}
