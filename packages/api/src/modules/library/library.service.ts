import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { map, forEachSeries } from 'p-iteration';
import { times } from 'lodash';

import {
  DeepPartial,
  TransactionManager,
  Transaction,
  EntityManager,
} from 'typeorm';

import { FileType } from 'src/app.dto';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { Movie } from 'src/entities/movie.entity';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';
import { TVShowDAO } from 'src/entities/dao/tvshow.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';

import { TMDBService } from 'src/modules/tmdb/tmdb.service';
import { JobsService } from 'src/modules/jobs/jobs.service';
import { TransmissionService } from 'src/modules/transmission/transmission.service';
import { TVShow } from 'src/entities/tvshow.entity';

@Injectable()
export class LibraryService {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly tvShowDAO: TVShowDAO,
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

  public async getTVShows() {
    const tvShows = await this.tvShowDAO.find({ order: { createdAt: 'ASC' } });
    const enrichedTVShows = map(tvShows, this.enrichTVShow);
    return enrichedTVShows;
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

  @Transaction()
  public async removeTVShow(
    tmdbId: number,
    @TransactionManager() manager?: EntityManager
  ) {
    const tvShowDAO = manager!.getCustomRepository(TVShowDAO);
    const tvShow = await tvShowDAO.findOneOrFail({
      where: { tmdbId },
      relations: ['seasons', 'episodes'],
    });

    await tvShowDAO.remove(tvShow);
  }

  @Transaction()
  public async trackTVShow(
    { tmdbId, seasonNumbers }: { tmdbId: number; seasonNumbers: number[] },
    @TransactionManager() manager?: EntityManager
  ) {
    const tvShowDAO = manager!.getCustomRepository(TVShowDAO);
    const tvSeasonDAO = manager!.getCustomRepository(TVSeasonDAO);
    const tvEpisodeDAO = manager!.getCustomRepository(TVEpisodeDAO);

    const tmdbTVShow = await this.tmdbService.getTVShow(tmdbId);
    const tvShow = await tvShowDAO.findOrCreate({
      tmdbId,
      title: tmdbTVShow.name,
    });

    await forEachSeries(seasonNumbers, async (seasonNumber) => {
      const tmdbSeason = tmdbTVShow.seasons.find(
        (_) => _.season_number === seasonNumber
      );

      if (!tmdbSeason) {
        throw new HttpException(
          `Season number ${seasonNumber} not found on TMDB`,
          HttpStatus.UNPROCESSABLE_ENTITY
        );
      }

      const alreadExists = await tvSeasonDAO.findOne({
        where: { tmdbId: tmdbSeason.id },
      });

      if (!alreadExists) {
        const season = await tvSeasonDAO.save({
          tvShow,
          seasonNumber,
          tmdbId: tmdbSeason.id,
        });

        await tvEpisodeDAO.save(
          times(tmdbSeason.episode_count, (episodeNumber) => ({
            tvShow,
            season,
            seasonNumber,
            episodeNumber: episodeNumber + 1,
          }))
        );

        await this.jobsService.startDownloadSeason(season.id);
      }
    });

    return tvShow;
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

  private enrichTVShow = async (tvShow: TVShow) => {
    const tmdbResult = await this.tmdbService.getTVShow(tvShow.tmdbId);
    return {
      ...tvShow,
      title: tmdbResult.name,
      originalTitle: tmdbResult.original_name,
      posterPath: tmdbResult.poster_path,
      voteAverage: tmdbResult.vote_average,
      releaseDate: tmdbResult.first_air_date,
    };
  };
}
