import dayjs from 'dayjs';
import leven from 'leven';
import path from 'path';
import { promises as fs } from 'fs';
import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import {
  filterSeries,
  forEach,
  forEachSeries,
  map,
  mapSeries,
} from 'p-iteration';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { times, orderBy } from 'lodash';
import { Job, Queue } from 'bull';

import { LIBRARY_CONFIG } from 'src/config';

import {
  JobsQueue,
  DownloadableMediaState,
  ScanLibraryQueueProcessors,
} from 'src/app.dto';

import { sanitize } from 'src/utils/sanitize';

import { TMDBService } from 'src/modules/tmdb/tmdb.service';
import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TVShowDAO } from 'src/entities/dao/tvshow.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';

import { JobsService } from '../jobs.service';
import { FileDAO } from 'src/entities/dao/file.dao';

@Processor(JobsQueue.SCAN_LIBRARY)
export class ScanLibraryProcessor {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectQueue(JobsQueue.SCAN_LIBRARY)
    private readonly scanLibraryQueue: Queue,
    private readonly jobsService: JobsService,
    private readonly tmdbService: TMDBService,
    private readonly tvEpisodeDAO: TVEpisodeDAO
  ) {
    this.logger = logger.child({ context: 'ScanLibrary' });
  }

  @Process(ScanLibraryQueueProcessors.FIND_NEW_EPISODES)
  public async findNewEpisodes() {
    this.logger.info('start find new tvshow episodes');

    const tvShowLastEpisodeTracked = await this.tvEpisodeDAO
      .createQueryBuilder('episode')
      .distinctOn(['episode.tvShow'])
      .leftJoinAndSelect('episode.tvShow', 'tvShow')
      .leftJoinAndSelect('episode.season', 'season')
      .orderBy('episode.tvShow', 'DESC')
      .addOrderBy('episode.seasonNumber', 'DESC')
      .addOrderBy('episode.episodeNumber', 'DESC')
      .getMany();

    this.logger.info(`found ${tvShowLastEpisodeTracked.length} seasons`);

    await forEachSeries(tvShowLastEpisodeTracked, async (episode) => {
      const tmdbResult = await this.tmdbService
        .getTVShowSeasons(episode.tvShow.tmdbId)
        .then((seasons) =>
          seasons.find((season) => season.seasonNumber === episode.seasonNumber)
        );

      if (!tmdbResult) {
        this.logger.info('did not find tmdb season', { episode });
        throw new Error('did not find tmdb season');
      }

      const newEpisodesCount = tmdbResult.episodeCount - episode.episodeNumber;

      this.logger.info(`found ${newEpisodesCount} new episodes`, {
        tvShow: episode.tvShow.title,
        seasonNumber: episode.seasonNumber,
      });

      if (newEpisodesCount > 0) {
        const newEpisodes = await this.tvEpisodeDAO.save(
          times(newEpisodesCount, (index) => ({
            tvShow: episode.tvShow,
            season: episode.season,
            episodeNumber: episode.episodeNumber + index + 1,
            seasonNumber: episode.seasonNumber,
          }))
        );

        await map(newEpisodes, ({ id }) => {
          this.jobsService.startDownloadEpisode(id);
        });
      }
    });

    this.logger.info('finish find new tsvhow episodes');
  }

  @Process(ScanLibraryQueueProcessors.SCAN_LIBRARY_FOLDER)
  public scanLibrary() {
    this.scanLibraryQueue.add(
      ScanLibraryQueueProcessors.SCAN_MOVIES_FOLDER,
      {}
    );

    this.scanLibraryQueue.add(
      ScanLibraryQueueProcessors.SCAN_TV_SHOWS_FOLDER,
      {}
    );
  }

  @Process(ScanLibraryQueueProcessors.SCAN_MOVIES_FOLDER)
  public async scanMoviesFolder() {
    this.logger.info('start scan movies folder', {
      folderName: LIBRARY_CONFIG.moviesFolderName,
    });

    const root = `/usr/library/${LIBRARY_CONFIG.moviesFolderName}`;
    const movies = await fs
      .readdir(root)
      .then((entries) =>
        filterSeries(entries, (entry) =>
          fs.stat(path.join(root, entry)).then((result) => result.isDirectory())
        )
      );

    this.logger.info(`found ${movies.length} movies on disk`);

    await forEach(movies, (movie) =>
      this.scanLibraryQueue.add(
        ScanLibraryQueueProcessors.PROCESS_MOVIE_FOLDER,
        { movie }
      )
    );

    this.logger.info('finish scan movies folder');
  }

  @Process(ScanLibraryQueueProcessors.SCAN_TV_SHOWS_FOLDER)
  public async scanTVShowsFolder() {
    this.logger.info('start scan tvshows folder', {
      folderName: LIBRARY_CONFIG.tvShowsFolderName,
    });

    const root = `/usr/library/${LIBRARY_CONFIG.tvShowsFolderName}`;
    const tvshows = (await fs.readdir(root, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    this.logger.info(`found ${tvshows.length} tvshows on disk`);

    await forEach(tvshows, (tvshow) =>
      this.scanLibraryQueue.add(
        ScanLibraryQueueProcessors.PROCESS_TV_SHOW_FOLDER,
        { tvshow }
      )
    );

    this.logger.info('finish scan tvshows folder');
  }

  @Process(ScanLibraryQueueProcessors.PROCESS_MOVIE_FOLDER)
  @Transaction()
  public async processMovieFolder(
    { data: { movie } }: Job<{ movie: string }>,
    @TransactionManager() manager?: EntityManager
  ) {
    this.logger.info('processing movie', { movie });

    const movieDAO = manager!.getCustomRepository(MovieDAO);
    const fileDAO = manager!.getCustomRepository(FileDAO);

    const root = `/usr/library/${LIBRARY_CONFIG.moviesFolderName}`;
    const movieFolder = path.join(root, movie);
    const movieFiles = (await fs.readdir(movieFolder, { withFileTypes: true }))
      .filter((dirent) => dirent.isFile())
      .map((dirent) => dirent.name);

    const files = await mapSeries(movieFiles, async (file) => {
      const match = await fileDAO.findOne({
        where: { path: path.join(movieFolder, file) },
        relations: ['movie'],
      });
      return { match, file: path.join(movieFolder, file) };
    });

    const movieInDatabase = files.find((file) => file.match?.movie);
    const untrackedFiles = files.filter((file) => !file.match);

    if (movieInDatabase) {
      this.logger.info('movie already tracked in library', { untrackedFiles });

      await forEachSeries(untrackedFiles, ({ file }) =>
        fileDAO.save({ path: file, movieId: movieInDatabase.match?.id })
      );

      return;
    }

    const [, title, year] = /^(.+) \((\d+)/.exec(movie) || [];

    if (!title || !year) {
      throw new Error(`cant parse movie name or year [${movie}]`);
    }

    this.logger.info('parsed filename', { title, year });

    const matchByTitle = await movieDAO.findOne({ where: { title } });

    if (matchByTitle) {
      this.logger.info('movie already in database', { title, year });

      await forEachSeries(untrackedFiles, ({ file }) =>
        fileDAO.save({ path: file, movieId: matchByTitle.id })
      );

      return;
    }

    const localizedResults = await this.tmdbService.searchMovie(title);
    const englishResults = await this.tmdbService.searchMovie(title, {
      language: 'en',
    });

    const results = [...localizedResults, ...englishResults];
    this.logger.info(`found ${results.length} potential match on tmdb`);

    const tmdbMovie = (() => {
      const [exactMatch] = results.filter(
        (result) =>
          dayjs(result.releaseDate).format('YYYY') === year &&
          (sanitize(title) === sanitize(result.title) ||
            sanitize(title) === sanitize(result.originalTitle))
      );

      if (exactMatch) {
        return exactMatch;
      }

      this.logger.warn('could not find exact match movie');
      this.logger.warn('fallback to year match and levenstein');

      const [bestMatch] = orderBy(
        results.filter(
          (result) => dayjs(result.releaseDate).format('YYYY') === year
        ),
        [(result) => leven(result.title, title)],
        ['asc']
      );

      if (bestMatch) {
        this.logger.warn(`best guessed match for ${title}`);
        this.logger.warn(bestMatch.title);
        return bestMatch;
      }

      return undefined;
    })();

    if (!tmdbMovie) {
      this.logger.error('no movie found matching title and year for');
      this.logger.error(`${title} (${year})`);
      return;
    }

    this.logger.info('found movie on tmdb', { tmdbId: tmdbMovie.tmdbId });

    const match = await movieDAO.findOne({
      where: { tmdbId: tmdbMovie.tmdbId },
    });

    if (match) {
      this.logger.info('movie already in library', {
        tmdbId: tmdbMovie.tmdbId,
      });

      await forEachSeries(untrackedFiles, ({ file }) =>
        fileDAO.save({ path: file, movieId: match.id })
      );
    } else {
      const newMovie = await movieDAO.save({
        title,
        tmdbId: tmdbMovie.id,
        state: DownloadableMediaState.PROCESSED,
      });

      await forEachSeries(untrackedFiles, ({ file }) =>
        fileDAO.save({ path: file, movieId: newMovie.id })
      );

      this.logger.info('new movie saved in database', {
        tmdbId: tmdbMovie.tmdbId,
      });
    }
  }

  @Process(ScanLibraryQueueProcessors.PROCESS_TV_SHOW_FOLDER)
  @Transaction()
  public async processTVShow(
    { data: { tvshow } }: Job<{ tvshow: string }>,
    @TransactionManager() manager?: EntityManager
  ) {
    this.logger.info('start processing tvshow', { tvshow });

    const tvShowDAO = manager!.getCustomRepository(TVShowDAO);
    const tvSeasonDAO = manager!.getCustomRepository(TVSeasonDAO);
    const tvEpisodeDAO = manager!.getCustomRepository(TVEpisodeDAO);

    const [tmdbResult] = await this.tmdbService.searchTVShow(tvshow, {
      language: 'en',
    });

    if (!tmdbResult) {
      this.logger.error('tvshow not found on tmdb', { tvshow });
      return;
    }

    this.logger.info('tvshow found on tmdb', { tmdbId: tmdbResult.tmdbId });
    const tvShow = await tvShowDAO.findOrCreate({
      tmdbId: tmdbResult.tmdbId,
      title: tvshow,
    });

    const root = `/usr/library/${LIBRARY_CONFIG.tvShowsFolderName}`;
    const seasons = await fs
      .readdir(path.join(root, tvshow))
      .then((entries) =>
        filterSeries(entries, (entry) =>
          fs
            .stat(path.join(root, tvshow, entry))
            .then((result) => result.isDirectory())
        )
      );

    const seasonEpisodes = await map<string, [number, number[]]>(
      seasons,
      async (season) => {
        const [seasonNumber] = /\d+/.exec(season) || [];
        if (!seasonNumber) {
          this.logger.error('could not parse season number', {
            season,
            seasonNumber,
          });
          throw new Error('could not parse season number');
        }

        const episodes = await fs
          .readdir(path.join(root, tvshow, season))
          .then((entries) =>
            entries.reduce((res, str) => {
              if (
                str.startsWith('.') ||
                str.endsWith('.srt') ||
                str.endsWith('.nfo')
              ) {
                return res;
              }

              // parse episode number from title
              const [, episodeNumber] = /E(\d+)/.exec(str) || [];
              if (episodeNumber) return [...res, parseInt(episodeNumber, 10)];

              this.logger.error('could not parse episode number', {
                file: str,
              });
              return res;
            }, [] as number[])
          );

        this.logger.info(
          `found season ${seasonNumber} with ${episodes.length} episodes`
        );

        return [parseInt(seasonNumber, 10), episodes];
      }
    );

    await forEachSeries(seasonEpisodes, async ([seasonNumber, episodes]) => {
      this.logger.info('start processing season', { seasonNumber });

      const tvSeason = await tvSeasonDAO.findOrCreate({
        tvShowId: tvShow.id,
        seasonNumber,
      });

      await forEachSeries(episodes, async (episodeNumber) => {
        this.logger.info(`start processing episode`, {
          season: seasonNumber,
          episode: episodeNumber,
        });

        const episode = await tvEpisodeDAO.findOrCreate({
          tvShowId: tvShow.id,
          seasonId: tvSeason.id,
          episodeNumber,
          seasonNumber,
        });

        await tvEpisodeDAO.save({
          id: episode.id,
          state: DownloadableMediaState.PROCESSED,
          season: tvSeason,
        });
      });

      await tvSeasonDAO.save({
        id: tvSeason.id,
        state: DownloadableMediaState.PROCESSED,
      });

      this.logger.info(`finish processing season`, { seasonNumber });
    });

    this.logger.info('finish processing tvshow', { tvshow });
  }
}
