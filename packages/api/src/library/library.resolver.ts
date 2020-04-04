import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { Movie } from 'src/entities/movie.entity';
import { MovieDAO } from 'src/entities/dao/movie.dao';

import { LibraryService } from './library.service';
import { EnrichedMovie } from './library.dto';

@Resolver()
export class LibraryResolver {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly libraryService: LibraryService
  ) {}

  @Query((_returns) => [EnrichedMovie])
  public getMovies() {
    return this.libraryService.getMovies();
  }

  @Mutation((_returns) => Movie, { name: 'trackMovie' })
  public trackMovie(
    @Args('title') title: string,
    @Args('tmdbId', { type: () => Int }) tmdbId: number
  ) {
    return this.movieDAO.save({ title, tmdbId });
  }
}
