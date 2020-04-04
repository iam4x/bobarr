import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';

import { Movie } from 'src/entities/movie.entity';
import { MovieDAO } from 'src/entities/dao/movie.dao';

@Resolver()
export class LibraryResolver {
  public constructor(private readonly movieDAO: MovieDAO) {}

  @Query((_returns) => [Movie])
  public getMovies() {
    return this.movieDAO.find({ order: { id: 'DESC' } });
  }

  @Mutation((_returns) => Movie, { name: 'trackMovie' })
  public trackMovie(
    @Args('title') title: string,
    @Args('tmdbId', { type: () => Int }) tmdbId: number
  ) {
    return this.movieDAO.save({ title, tmdbId });
  }
}
