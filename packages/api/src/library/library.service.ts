import { Injectable } from '@nestjs/common';
import { DeepPartial } from 'typeorm';
import { map } from 'p-iteration';

import { TMDBService } from 'src/tmdb/tmdb.service';
import { MovieDAO } from 'src/entities/dao/movie.dao';
import { Movie } from 'src/entities/movie.entity';
import { JobsService } from 'src/jobs/jobs.service';

@Injectable()
export class LibraryService {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly tmdbService: TMDBService,
    private readonly jobsService: JobsService
  ) {}

  public async trackMovie(movieAttributes: DeepPartial<Movie>) {
    const movie = await this.movieDAO.save(movieAttributes);
    await this.jobsService.startDownloadMovie(movie.id);
    return movie;
  }

  public async getMovies() {
    const movies = await this.movieDAO.find({ order: { createdAt: 'DESC' } });
    const enrichedMovies = map(movies, this.enrichMovie);
    return enrichedMovies;
  }

  public async getMovie(movieId: number) {
    const movie = await this.movieDAO.findOneOrFail(movieId);
    return this.enrichMovie(movie);
  }

  private enrichMovie = async (movie: Movie) => {
    const tmdbResult = await this.tmdbService.getMovie(movie.tmdbId);
    return {
      ...movie,
      title: tmdbResult.title,
      posterPath: tmdbResult.poster_path,
      voteAverage: tmdbResult.vote_average,
      releaseDate: tmdbResult.release_date,
    };
  };
}
