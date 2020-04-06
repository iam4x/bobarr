import dayjs from 'dayjs';
import scan from 'scandirectory';
import { promises as fs } from 'fs';
import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { forEachSeries, map } from 'p-iteration';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';
import { isPlainObject } from 'lodash';

import { JobsQueue, DownloadableMediaState } from 'src/app.dto';
import { TMDBService } from 'src/modules/tmdb/tmdb.service';
import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TVShowDAO } from 'src/entities/dao/tvshow.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';

@Processor(JobsQueue.SCAN_LIBRARY)
export class ScanLibraryProcessor {
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly tmdbService: TMDBService
  ) {
    this.logger = logger.child({ context: 'ScanLibrary' });
  }

  @Process()
  public async scanLibrary() {
    this.logger.info('start scan library');
    await this.scanMoviesFolder();
    await this.scanTVShowsFolder();
    this.logger.info('finish scan library');
  }

  @Transaction()
  private async scanTVShowsFolder(
    @TransactionManager() manager?: EntityManager
  ) {
    this.logger.info('start scan tvshows folder');
    const tvShowDAO = manager!.getCustomRepository(TVShowDAO);
    const tvSeasonDAO = manager!.getCustomRepository(TVSeasonDAO);
    const tvEpisodeDAO = manager!.getCustomRepository(TVEpisodeDAO);

    const root = '/usr/library/tvshows';
    const tvshows = (await fs.readdir(root, { withFileTypes: true }))
      .filter((dirent) => dirent.isDirectory())
      .map((dirent) => dirent.name);

    this.logger.info(`found ${tvshows.length} tvshows on disk`);

    await forEachSeries(tvshows, async (tvshow) => {
      this.logger.info('start processing tvshow', { tvshow });

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

      const seasons = await this.scanDirectoryTree(`${root}/${tvshow}`)
        .then(({ tree }) => Object.entries(tree))
        .then((tree) => tree.filter(([, episodes]) => isPlainObject(episodes)));

      const seasonEpisodes: Array<[number, number[]]> = seasons.map(
        ([season, episodeObj]) => {
          const [seasonNumber] = /\d+/.exec(season) || [];
          if (!seasonNumber) {
            this.logger.error('could not parse season number', {
              season,
              seasonNumber,
            });
            throw new Error('could not parse season number');
          }

          const episodes = Object.keys(episodeObj).reduce<number[]>(
            (res, str) => {
              // if file is a srt file dont try to add as an episode
              if (str.startsWith('.') || str.endsWith('.srt')) return res;

              // parse episode number from title
              const [, episodeNumber] = /E(\d+)/.exec(str) || [];
              if (episodeNumber) return [...res, parseInt(episodeNumber, 10)];

              this.logger.error('could not parse episode number', {
                file: str,
              });
              return res;
            },
            []
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
          tvShow,
          seasonNumber,
        });

        await map(episodes, async (episodeNumber) => {
          const episode = await tvEpisodeDAO.findOrCreate({
            tvShow,
            episodeNumber,
            seasonNumber,
          });
          await tvEpisodeDAO.save({
            id: episode.id,
            state: DownloadableMediaState.PROCESSED,
          });
        });

        await tvSeasonDAO.save({
          id: tvSeason.id,
          state: DownloadableMediaState.PROCESSED,
        });

        this.logger.info(`finish processing season`, { seasonNumber });
      });

      this.logger.info('finish processing tvshow', { tvshow });
    });

    this.logger.info('finish scan tvshows folder');
  }

  @Transaction()
  private async scanMoviesFolder(
    @TransactionManager() manager?: EntityManager
  ) {
    this.logger.info('start scan movies folder');
    const movieDAO = manager!.getCustomRepository(MovieDAO);

    const { tree } = await this.scanDirectoryTree('/usr/library/movies');
    const movies = Object.entries(tree)
      .filter(([, value]) => typeof value === 'object')
      .map(([key]) => key);

    this.logger.info(`found ${movies.length} movies on disk`);

    await forEachSeries(movies, async (movie) => {
      this.logger.info('processing movie', { movie });
      const [, title, year] = /^(.+) \((\d+)/.exec(movie) || [];

      if (!title || !year) {
        throw new Error('cant parse movie name or year');
      }

      this.logger.info('parsed filename', { title, year });

      const results = await this.tmdbService.searchMovie(title, {
        language: 'en',
      });

      const [tmdbMovie] = results.filter(
        (result) =>
          dayjs(result.releaseDate).format('YYYY') === year &&
          result.title === title
      );

      if (!tmdbMovie) {
        throw new Error(`movie ${title} not found in tmdb`);
      }

      this.logger.info('found movie on tmdb', { tmdbId: tmdbMovie.tmdbId });

      const match = await movieDAO.findOne({
        where: { tmdbId: tmdbMovie.tmdbId },
      });

      if (match) {
        this.logger.info('movie already in library', {
          tmdbId: tmdbMovie.tmdbId,
        });
      } else {
        await movieDAO.save({
          tmdbId: tmdbMovie.id,
          title: tmdbMovie.title,
          state: DownloadableMediaState.PROCESSED,
        });
        this.logger.info('new movie saved in database', {
          tmdbId: tmdbMovie.tmdbId,
        });
      }
    });

    this.logger.info('finish scan movies folder');
  }

  private scanDirectoryTree(
    folderPath: string
  ): Promise<{ tree: Record<string, any>; list: Record<string, any> }> {
    return new Promise((resolve, reject) => {
      scan(
        folderPath,
        {},
        (
          err: Error | null,
          list: Record<string, any>,
          tree: Record<string, any>
        ) => (err ? reject(err) : resolve({ list, tree }))
      );
    });
  }
}
