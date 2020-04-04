import { Injectable } from '@nestjs/common';
import {
  DeepPartial,
  TransactionManager,
  Transaction,
  EntityManager,
} from 'typeorm';
import { map } from 'p-iteration';

import { FileType } from 'src/app.dto';
import { TMDBService } from 'src/tmdb/tmdb.service';
import { MovieDAO } from 'src/entities/dao/movie.dao';
import { Movie } from 'src/entities/movie.entity';
import { JobsService } from 'src/jobs/jobs.service';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';
import { TransmissionService } from 'src/transmission/transmission.service';

@Injectable()
export class LibraryService {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly tmdbService: TMDBService,
    private readonly jobsService: JobsService,
    private readonly transmissionService: TransmissionService
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

  @Transaction()
  public async removeMovie(
    tmdbId: number,
    @TransactionManager() manager?: EntityManager
  ) {
    const movieDAO = manager!.getCustomRepository(MovieDAO);
    const torrentDAO = manager!.getCustomRepository(TorrentDAO);

    const movie = await movieDAO.findOneOrFail({ where: { tmdbId } });
    const torrent = await torrentDAO.findOne({
      resourceType: FileType.MOVIE,
      resourceId: movie.id,
    });

    if (torrent) {
      await this.transmissionService.removeTorrentAndFiles(torrent.torrentHash);
      await torrentDAO.remove(torrent);
    }

    await movieDAO.remove(movie);
  }

  private enrichMovie = async (movie: Movie) => {
    const tmdbResult = await this.tmdbService.getMovie(movie.tmdbId);
    return {
      ...movie,
      title: tmdbResult.title,
      originalTitle: tmdbResult.original_title,
      posterPath: tmdbResult.poster_path,
      voteAverage: tmdbResult.vote_average,
      releaseDate: tmdbResult.release_date,
    };
  };
}
