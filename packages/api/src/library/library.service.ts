import { Injectable } from '@nestjs/common';
import { map } from 'p-iteration';

import { TMDBService } from 'src/tmdb/tmdb.service';
import { MovieDAO } from 'src/entities/dao/movie.dao';

@Injectable()
export class LibraryService {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly tmdbService: TMDBService
  ) {}

  public async getMovies() {
    const movies = await this.movieDAO.find({ order: { createdAt: 'DESC' } });
    const enrichedMovies = map(movies, async (movie) => {
      const tmdbResult = await this.tmdbService.getMovie(movie.tmdbId);
      return {
        ...movie,
        title: tmdbResult.title,
        posterPath: tmdbResult.poster_path,
        voteAverage: tmdbResult.vote_average,
        releaseDate: tmdbResult.release_date,
      };
    });
    return enrichedMovies;
  }
}
