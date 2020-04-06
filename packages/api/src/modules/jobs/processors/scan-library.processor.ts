import dayjs from 'dayjs';
import scan from 'scandirectory';
import { Processor, Process } from '@nestjs/bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { forEachSeries } from 'p-iteration';
import { Transaction, TransactionManager, EntityManager } from 'typeorm';

import { JobsQueue, DownloadableMediaState } from 'src/app.dto';
import { TMDBService } from 'src/modules/tmdb/tmdb.service';
import { MovieDAO } from 'src/entities/dao/movie.dao';

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
  }

  @Transaction()
  private async scanMoviesFolder(
    @TransactionManager() manager?: EntityManager
  ) {
    this.logger.info('scan movies folder');
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
