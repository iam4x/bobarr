import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { forEachSeries } from 'p-iteration';
import { Job, Queue } from 'bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import {
  JobsQueue,
  DownloadableMediaState,
  DownloadQueueProcessors,
} from 'src/app.dto';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';

import { JackettService } from 'src/modules/jackett/jackett.service';
import { LibraryService } from 'src/modules/library/library.service';

@Processor(JobsQueue.DOWNLOAD)
export class DownloadProcessor {
  // eslint-disable-next-line max-params
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectQueue(JobsQueue.DOWNLOAD) private readonly downloadQueue: Queue,
    private readonly movieDAO: MovieDAO,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly tvEpisodeDAO: TVEpisodeDAO,
    private readonly jackettService: JackettService,
    private readonly libraryService: LibraryService
  ) {
    this.logger = logger.child({ context: 'DownloadProcessor' });
  }

  @Process(DownloadQueueProcessors.DOWNLOAD_MISSING)
  public async downloadMissing() {
    this.logger.info('start try download missing files');

    const missingMovies = await this.movieDAO.find({
      where: { state: DownloadableMediaState.MISSING },
    });

    this.logger.info(`found ${missingMovies.length} missing movies`);

    await forEachSeries(missingMovies, (movie) =>
      this.downloadQueue.add(DownloadQueueProcessors.DOWNLOAD_MOVIE, movie.id)
    );

    const missingEpisodes = await this.tvEpisodeDAO.findMissingFromLibrary();
    this.logger.info(`found ${missingEpisodes.length} missing tv episodes`);

    await forEachSeries(missingEpisodes, (episode) =>
      this.downloadQueue.add(
        DownloadQueueProcessors.DOWNLOAD_EPISODE,
        episode.id
      )
    );

    this.logger.info('finish try download missing files');
  }

  @Process(DownloadQueueProcessors.DOWNLOAD_MOVIE)
  public async downloadMovie({ data: movieId }: Job<number>) {
    this.logger.info('start download movie', { movieId });

    const [bestResult] = await this.jackettService.searchMovie(movieId);
    if (!(await this.canRun({ movieId }))) return;

    if (bestResult === undefined) {
      this.logger.error('movie torrent not found');
      await this.movieDAO.save({
        id: movieId,
        state: DownloadableMediaState.MISSING,
      });
      return;
    }

    await this.libraryService.downloadMovie(
      movieId,
      {
        title: bestResult.title,
        downloadLink: bestResult.downloadLink,
        tag: bestResult.tag.label,
        quality: bestResult.quality.label,
      },
      null
    );

    return;
  }

  @Process(DownloadQueueProcessors.DOWNLOAD_SEASON)
  public async downloadSeason({ data: seasonId }: Job<number>) {
    this.logger.info('start download season', { seasonId });

    const [bestResult] = await this.jackettService.searchSeason(seasonId);
    if (!(await this.canRun({ seasonId }))) return;

    if (bestResult === undefined) {
      this.logger.error('season not found, will split download into episodes');

      // set season as processed we wont rety a full episodes pack download
      await this.tvSeasonDAO.save({
        id: seasonId,
        state: DownloadableMediaState.PROCESSED,
      });

      const season = await this.tvSeasonDAO.findOne({
        where: { id: seasonId },
        relations: ['episodes'],
      });

      // season can already be removed from library
      if (season) {
        await forEachSeries(season.episodes, (episode) =>
          this.downloadQueue.add(
            DownloadQueueProcessors.DOWNLOAD_EPISODE,
            episode.id
          )
        );
      }

      return;
    }

    await this.libraryService.downloadTVSeason(
      seasonId,
      {
        title: bestResult.title,
        downloadLink: bestResult.downloadLink,
        tag: bestResult.tag.label,
        quality: bestResult.quality.label,
      },
      null
    );

    return;
  }

  @Process(DownloadQueueProcessors.DOWNLOAD_EPISODE)
  public async downloadEpisode({ data: episodeId }: Job<number>) {
    this.logger.info('start download episode', { episodeId });

    const [bestResult] = await this.jackettService.searchEpisode(episodeId);
    if (!(await this.canRun({ episodeId }))) return;

    if (bestResult === undefined) {
      this.logger.error('episode torrent not found');
      await this.tvEpisodeDAO.save({
        id: episodeId,
        state: DownloadableMediaState.MISSING,
      });
      return;
    }

    await this.libraryService.downloadTVEpisode(
      episodeId,
      {
        title: bestResult.title,
        downloadLink: bestResult.downloadLink,
        tag: bestResult.tag.label,
        quality: bestResult.quality.label,
      },
      null
    );

    return;
  }

  // check if job should continue
  // media can be already removed from database
  // when results are found from jackett
  private async canRun(media: {
    movieId?: number;
    seasonId?: number;
    episodeId?: number;
  }) {
    if (
      (media.movieId && !(await this.movieDAO.findOne(media.movieId))) ||
      (media.seasonId && !(await this.tvSeasonDAO.findOne(media.seasonId))) ||
      (media.episodeId && !(await this.tvEpisodeDAO.findOne(media.episodeId)))
    ) {
      this.logger.warn(
        'media already removed from database, this job will stop',
        media
      );
      return false;
    }

    return true;
  }
}
