import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { map, forEachSeries, forEach, reduce } from 'p-iteration';
import { times } from 'lodash';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import childCommand from 'child-command';
import dayjs from 'dayjs';
import path from 'path';

import {
  DeepPartial,
  TransactionManager,
  Transaction,
  EntityManager,
} from 'typeorm';

import { FileType, DownloadableMediaState } from 'src/app.dto';

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
import { TVSeason } from 'src/entities/tvseason.entity';
import { TVEpisode } from 'src/entities/tvepisode.entity';

@Injectable()
export class LibraryService {
  // eslint-disable-next-line max-params
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly movieDAO: MovieDAO,
    private readonly tvShowDAO: TVShowDAO,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly tvEpisodeDAO: TVEpisodeDAO,
    private readonly tmdbService: TMDBService,
    private readonly jobsService: JobsService,
    private readonly torrentDAO: TorrentDAO,
    private readonly transmissionService: TransmissionService
  ) {
    this.logger = logger.child({ context: 'LibraryService' });
  }

  public async getDownloadingMedias() {
    const movies = await this.movieDAO.find({
      where: { state: DownloadableMediaState.DOWNLOADING },
    });

    const tvSeasons = await this.tvSeasonDAO.find({
      where: { state: DownloadableMediaState.DOWNLOADING },
      relations: ['tvShow'],
    });

    const tvEpisodes = await this.tvEpisodeDAO.find({
      where: { state: DownloadableMediaState.DOWNLOADING },
      relations: ['season', 'season.tvShow'],
    });

    const mixed = [
      ...movies.map((movie) => ({
        title: movie.title,
        resourceId: movie.id,
        resourceType: FileType.MOVIE,
      })),
      ...tvSeasons.map((season) => ({
        title: season.title,
        resourceId: season.id,
        resourceType: FileType.SEASON,
      })),
      ...tvEpisodes.map((episode) => ({
        title: episode.title,
        resourceId: episode.id,
        resourceType: FileType.EPISODE,
      })),
    ];

    const withTorrentQuality = await map(mixed, async (resource) => {
      const { tag, quality } = await this.torrentDAO.findOneOrFail({
        where: {
          resourceId: resource.resourceId,
          resourceType: resource.resourceType,
        },
      });
      const newTitle = `${resource.title} - ${tag.toUpperCase()} ${quality}`;
      return { ...resource, title: newTitle };
    });

    return withTorrentQuality;
  }

  public async trackMovie(movieAttributes: DeepPartial<Movie>) {
    this.logger.info('track movie', { tmdbId: movieAttributes.tmdbId });
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
    const enrichedTVShows = map(tvShows, (tvShow) => this.enrichTVShow(tvShow));
    return enrichedTVShows;
  }

  public async getTVShow(tvShowId: number, params?: { language: string }) {
    const tvShow = await this.tvShowDAO.findOneOrFail(tvShowId);
    return this.enrichTVShow(tvShow, params);
  }

  public async findMissingTVEpisodes() {
    const rows = await this.tvEpisodeDAO.findMissingFromLibrary();
    return rows.map(this.enrichTVEpisode);
  }

  public async findMissingMovies() {
    const rows = await this.movieDAO.find({
      where: { state: DownloadableMediaState.MISSING },
    });
    return rows.map(this.enrichMovie);
  }

  @Transaction()
  public async removeMovie(
    tmdbId: number,
    @TransactionManager() manager?: EntityManager
  ) {
    this.logger.info('start remove movie', { tmdbId });
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
      this.logger.info('movie torrent removed', { torrent: torrent.id });
    }

    const enrichedMovie = await this.getMovie(movie.id);
    const year = dayjs(enrichedMovie.releaseDate).format('YYYY');
    const folderName = `${movie.title} (${year})`;
    const folderPath = path.resolve(
      __dirname,
      '../../../../../library/movies',
      folderName
    );

    await childCommand(`rm -rf "${folderPath}"`);
    this.logger.info('movie files and folder deleted from file system');

    await movieDAO.remove(movie);
    this.logger.info('finish remove movie', { tmdbId });
  }

  @Transaction()
  public async removeTVShow(
    tmdbId: number,
    @TransactionManager() manager?: EntityManager
  ) {
    this.logger.info('start remove tv show', { tmdbId });

    const tvShowDAO = manager!.getCustomRepository(TVShowDAO);
    const torrentDAO = manager!.getCustomRepository(TorrentDAO);

    const tvShow = await tvShowDAO.findOneOrFail({
      where: { tmdbId },
      relations: ['seasons', 'episodes'],
    });

    await forEach(tvShow.seasons, async (season) => {
      const torrent = await torrentDAO.findOne({
        resourceId: season.id,
        resourceType: FileType.SEASON,
      });

      if (torrent) {
        await torrentDAO.remove(torrent);
        await this.transmissionService.removeTorrentAndFiles(
          torrent.torrentHash
        );
        this.logger.info('season torrent removed', { torrent: torrent.id });
      }
    });

    await forEach(tvShow.episodes, async (episode) => {
      const torrent = await torrentDAO.findOne({
        resourceId: episode.id,
        resourceType: FileType.EPISODE,
      });

      if (torrent) {
        await torrentDAO.remove(torrent);
        await this.transmissionService.removeTorrentAndFiles(
          torrent.torrentHash
        );
        this.logger.info('episode torrent removed', { torrent: torrent.id });
      }
    });

    const enTVShow = await this.getTVShow(tvShow.id, { language: 'en' });
    const tvShowFolder = path.resolve(
      __dirname,
      '../../../../../library/tvshows/',
      enTVShow.title
    );

    await childCommand(`rm -rf "${tvShowFolder}"`);
    this.logger.info('tv show files and folder deleted from file system');

    await tvShowDAO.remove(tvShow);
    this.logger.info('finish remove tv show', { tmdbId });
  }

  public async trackTVShow({
    tmdbId,
    seasonNumbers,
  }: {
    tmdbId: number;
    seasonNumbers: number[];
  }) {
    this.logger.info('track tv show', { tmdbId });

    const { tvShow, missingSeasons } = await this.trackMissingSeasons({
      tmdbId,
      seasonNumbers,
    });

    // start jobs outside of transaction
    await forEachSeries(missingSeasons, (season) =>
      this.jobsService.startDownloadSeason(season.id)
    );

    return tvShow;
  }

  @Transaction()
  private async trackMissingSeasons(
    { tmdbId, seasonNumbers }: { tmdbId: number; seasonNumbers: number[] },
    @TransactionManager() manager?: EntityManager
  ) {
    this.logger.info('track missing seasons', { seasonNumbers });

    const tvShowDAO = manager!.getCustomRepository(TVShowDAO);
    const tvSeasonDAO = manager!.getCustomRepository(TVSeasonDAO);
    const tvEpisodeDAO = manager!.getCustomRepository(TVEpisodeDAO);

    const tmdbTVShow = await this.tmdbService.getTVShow(tmdbId);
    const tvShow = await tvShowDAO.findOrCreate({
      tmdbId,
      title: tmdbTVShow.name,
    });

    const missingSeasons = await reduce(
      seasonNumbers,
      async (result, seasonNumber) => {
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
          where: { tvShow, seasonNumber },
        });

        if (!alreadExists) {
          const season = await tvSeasonDAO.save({
            tvShow,
            seasonNumber,
          });

          this.logger.info('new season added to library', {
            seasonId: season.id,
          });

          await tvEpisodeDAO.save(
            times(tmdbSeason.episode_count, (episodeNumber) => ({
              tvShow,
              season,
              seasonNumber,
              episodeNumber: episodeNumber + 1,
            }))
          );

          this.logger.info('new season episodes added to library', {
            seasonId: season.id,
          });

          return [...result, season];
        }

        return result;
      },
      [] as TVSeason[]
    );

    return {
      tvShow,
      missingSeasons,
    };
  }

  private enrichMovie = async (movie: Movie) => {
    const tmdbResult = await this.tmdbService.getMovie(movie.tmdbId);
    return {
      ...movie,
      title: tmdbResult.title,
      originalTitle: tmdbResult.original_title,
      originCountry: tmdbResult.original_language,
      posterPath: tmdbResult.poster_path,
      voteAverage: tmdbResult.vote_average,
      releaseDate: tmdbResult.release_date,
    };
  };

  private enrichTVShow = async (
    tvShow: TVShow,
    params?: { language: string }
  ) => {
    const tmdbResult = await this.tmdbService.getTVShow(tvShow.tmdbId, params);
    return {
      ...tvShow,
      title: tmdbResult.name,
      originalTitle: tmdbResult.original_name,
      originCountry: tmdbResult.origin_country,
      posterPath: tmdbResult.poster_path,
      voteAverage: tmdbResult.vote_average,
      releaseDate: tmdbResult.first_air_date,
    };
  };

  private enrichTVEpisode = async (tvEpisode: TVEpisode) => {
    const tmdbResult = await this.tmdbService.getTVEpisode(
      tvEpisode.tvShow.tmdbId,
      tvEpisode.seasonNumber,
      tvEpisode.episodeNumber
    );

    return {
      ...tvEpisode,
      releaseDate: tmdbResult.air_date,
    };
  };
}
