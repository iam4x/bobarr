import { Injectable, HttpException, HttpStatus, Inject } from '@nestjs/common';
import { map, forEachSeries, forEach, reduce, mapSeries } from 'p-iteration';
import { times } from 'lodash';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import childCommand from 'child-command';
import dayjs from 'dayjs';
import path from 'path';

import { DeepPartial, TransactionManager, EntityManager, Any } from 'typeorm';

import { LIBRARY_CONFIG } from 'src/config';

import { FileType, DownloadableMediaState } from 'src/app.dto';
import { LazyTransaction } from 'src/utils/lazy-transaction';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { Movie } from 'src/entities/movie.entity';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';
import { TVShowDAO } from 'src/entities/dao/tvshow.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';
import { MediaViewDAO } from 'src/entities/dao/media-view.dao';
import { TVShow } from 'src/entities/tvshow.entity';
import { TVSeason } from 'src/entities/tvseason.entity';
import { TVEpisode } from 'src/entities/tvepisode.entity';
import { ParameterDAO } from 'src/entities/dao/parameter.dao';
import { QualityDAO } from 'src/entities/dao/quality.dao';
import { TagDAO } from 'src/entities/dao/tag.dao';

import { TMDBService } from 'src/modules/tmdb/tmdb.service';
import { JobsService } from 'src/modules/jobs/jobs.service';
import { TransmissionService } from 'src/modules/transmission/transmission.service';
import { ParamsService } from 'src/modules/params/params.service';

import { JackettInput } from './library.dto';

@Injectable()
export class LibraryService {
  // eslint-disable-next-line max-params
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly movieDAO: MovieDAO,
    private readonly tvShowDAO: TVShowDAO,
    private readonly tvEpisodeDAO: TVEpisodeDAO,
    private readonly tmdbService: TMDBService,
    private readonly jobsService: JobsService,
    private readonly transmissionService: TransmissionService,
    private readonly mediaViewDAO: MediaViewDAO,
    private readonly paramsService: ParamsService
  ) {
    this.logger = logger.child({ context: 'LibraryService' });

    this.getTVSeasonDetails({ tvShowTMDBId: 60625, seasonNumber: 4 });
  }

  public async getDownloading() {
    const downloading = await this.mediaViewDAO.find({
      order: { id: 'ASC' },
      where: { state: DownloadableMediaState.DOWNLOADING },
    });

    const withTorrentQuality = await map(downloading, async (resource) => {
      const {
        tag,
        quality,
        transmissionTorrent,
      } = await this.transmissionService.getResourceTorrent({
        resourceId: resource.resourceId,
        resourceType: resource.resourceType,
      });

      // torrent can be deleted from transmission but not yet deleted from database
      // refresh downloading happens often this avoid errors when it's deleting
      return transmissionTorrent
        ? { ...resource, tag, quality, torrent: transmissionTorrent?.name }
        : null;
    });

    return withTorrentQuality.filter(Boolean);
  }

  public async getSearching() {
    const searching = await this.mediaViewDAO.find({
      where: { state: DownloadableMediaState.SEARCHING },
    });

    const downloadingSeasons = await this.mediaViewDAO.find({
      where: {
        state: Any([
          DownloadableMediaState.DOWNLOADING,
          DownloadableMediaState.SEARCHING,
        ]),
        resourceType: FileType.SEASON,
      },
    });

    const withoutEpisodesDownloadingAsSeason = searching.filter((row) =>
      row.resourceType === FileType.EPISODE
        ? !downloadingSeasons.some((season) => row.title.includes(season.title))
        : true
    );

    return withoutEpisodesDownloadingAsSeason;
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

  public async calendar() {
    const movies = await mapSeries(
      await this.movieDAO.find(),
      this.enrichMovie
    );

    const tvEpisodes = await mapSeries(
      await this.tvEpisodeDAO.find({ relations: ['tvShow'] }),
      this.enrichTVEpisode
    );

    return { movies, tvEpisodes };
  }

  @LazyTransaction()
  public async removeMovie(
    { tmdbId, softDelete = false }: { tmdbId: number; softDelete?: boolean },
    @TransactionManager() manager: EntityManager | null
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
      `../../../../../library/${LIBRARY_CONFIG.moviesFolderName}`,
      folderName
    );

    await childCommand(`rm -rf "${folderPath}"`);
    this.logger.info('movie files and folder deleted from file system');

    if (softDelete) {
      await movieDAO.save({
        id: movie.id,
        state: DownloadableMediaState.MISSING,
      });
    } else {
      await movieDAO.remove(movie);
    }

    this.logger.info('finish remove movie', { tmdbId });
  }

  @LazyTransaction()
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
      `../../../../../library/${LIBRARY_CONFIG.tvShowsFolderName}/`,
      enTVShow.title
    );

    await childCommand(`rm -rf "${tvShowFolder}"`);
    this.logger.info('tv show files and folder deleted from file system');

    await tvShowDAO.remove(tvShow);
    this.logger.info('finish remove tv show', { tmdbId });
  }

  @LazyTransaction()
  public async downloadMovie(
    movieId: number,
    jackettResult: JackettInput,
    @TransactionManager() manager: EntityManager | null
  ) {
    this.logger.info('start download movie', { movieId });
    this.logger.info(jackettResult.title);

    const movieDAO = manager!.getCustomRepository(MovieDAO);
    const movie = await movieDAO.findOneOrFail(movieId);

    if (movie.state !== DownloadableMediaState.MISSING) {
      await this.removeMovie(
        { tmdbId: movie.tmdbId, softDelete: true },
        manager
      );
    }

    await movieDAO.save({
      id: movieId,
      state: DownloadableMediaState.DOWNLOADING,
    });

    const torrent = await this.transmissionService.addTorrent(
      {
        torrent: jackettResult.downloadLink,
        torrentType: 'url',
        torrentAttributes: {
          resourceType: FileType.MOVIE,
          resourceId: movieId,
          quality: jackettResult.quality,
          tag: jackettResult.tag,
        },
      },
      manager
    );

    this.logger.info('download movie started', {
      movieId,
      torrent: torrent.id,
    });
  }

  @LazyTransaction()
  public async downloadTVSeason(
    seasonId: number,
    jackettResult: JackettInput,
    @TransactionManager() manager: EntityManager | null
  ) {
    this.logger.info('start download tv season', { seasonId });
    this.logger.info(jackettResult.title);

    await manager!.getCustomRepository(TVSeasonDAO).save({
      id: seasonId,
      state: DownloadableMediaState.DOWNLOADING,
    });

    const torrent = await this.transmissionService.addTorrent(
      {
        torrent: jackettResult.downloadLink,
        torrentType: 'url',
        torrentAttributes: {
          resourceType: FileType.SEASON,
          resourceId: seasonId,
          quality: jackettResult.quality,
          tag: jackettResult.tag,
        },
      },
      manager
    );

    this.logger.info('download tv season started', {
      seasonId,
      torrentId: torrent.id,
    });
  }

  @LazyTransaction()
  public async downloadTVEpisode(
    episodeId: number,
    jackettResult: JackettInput,
    @TransactionManager() manager: EntityManager | null
  ) {
    this.logger.info('start download tv episode', { episodeId });
    this.logger.info(jackettResult.title);

    await this.replaceTVEpisode(episodeId, manager!);

    const torrent = await this.transmissionService.addTorrent(
      {
        torrent: jackettResult.downloadLink,
        torrentType: 'url',
        torrentAttributes: {
          resourceType: FileType.EPISODE,
          resourceId: episodeId,
          quality: jackettResult.quality,
          tag: jackettResult.tag,
        },
      },
      manager
    );

    this.logger.info('download episode started', {
      episodeId,
      torrentId: torrent.id,
    });
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

  @LazyTransaction()
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

  public async getTVSeasonDetails({
    tvShowTMDBId,
    seasonNumber,
  }: {
    tvShowTMDBId: number;
    seasonNumber: number;
  }) {
    const episodes = await this.tvEpisodeDAO
      .createQueryBuilder('episode')
      .innerJoinAndSelect(
        'episode.tvShow',
        'tvShow',
        'tvShow.tmdbId = :tvShowTMDBId',
        { tvShowTMDBId }
      )
      .where('episode.seasonNumber = :seasonNumber', { seasonNumber })
      .orderBy('episode.episodeNumber')
      .getMany();
    return map(episodes, this.enrichTVEpisode);
  }

  @LazyTransaction()
  public async reset(
    {
      deleteFiles = false,
      resetSettings = false,
    }: { deleteFiles: boolean; resetSettings: boolean },
    @TransactionManager() manager: EntityManager | null
  ) {
    this.logger.info('start reset library', { deleteFiles, resetSettings });

    await manager!.getCustomRepository(MovieDAO).delete({});
    await manager!.getCustomRepository(TVShowDAO).delete({});
    await manager!.getCustomRepository(TVSeasonDAO).delete({});
    await manager!.getCustomRepository(TVEpisodeDAO).delete({});

    if (deleteFiles) {
      await forEachSeries(
        await manager!.getCustomRepository(TorrentDAO).find(),
        (torrent) =>
          this.transmissionService.removeTorrentAndFiles(torrent.torrentHash)
      );
      await manager!.getCustomRepository(TorrentDAO).delete({});
    }

    if (resetSettings) {
      await manager!.getCustomRepository(ParameterDAO).delete({});
      await manager!.getCustomRepository(QualityDAO).delete({});
      await manager!.getCustomRepository(TagDAO).delete({});
      await this.paramsService.initializeParamsStore(manager);
      await this.paramsService.initializeQuality(manager);
    }

    this.jobsService.startScanLibrary();

    this.logger.info('finish reset library', { deleteFiles, resetSettings });
  }

  @LazyTransaction()
  public async downloadOwnTorrent(
    {
      mediaId,
      mediaType,
      torrent,
    }: {
      mediaId: number;
      mediaType: FileType;
      torrent: string;
    },
    @TransactionManager() manager: EntityManager | null
  ) {
    this.logger.info('start download own torrent', { mediaId, mediaType });

    const baseOpts = {
      torrent,
      torrentType: torrent.startsWith('magnet') ? 'url' : 'base64',
      torrentAttributes: {
        resourceId: mediaId,
        resourceType: mediaType,
      },
    } as const;

    if (mediaType === FileType.EPISODE) {
      await this.replaceTVEpisode(mediaId, manager!);
    }

    if (mediaType === FileType.MOVIE) {
      await this.replaceMovie(mediaId, manager!);
    }

    const torrentEntity = await this.transmissionService.addTorrent(
      baseOpts,
      manager
    );

    this.logger.info('download started', {
      mediaId,
      mediaType,
      torrentId: torrentEntity.id,
    });
  }

  private async replaceTVEpisode(episodeId: number, manager: EntityManager) {
    const tvEpisodeDAO = manager!.getCustomRepository(TVEpisodeDAO);
    const torrentDAO = manager!.getCustomRepository(TorrentDAO);

    const tvEpisode = await tvEpisodeDAO.findOneOrFail({ id: episodeId });

    if (tvEpisode.state !== DownloadableMediaState.MISSING) {
      this.logger.info('episode already downloaded, removing existing files');

      const torrents = await torrentDAO.find({
        where: { resourceId: episodeId, resourceType: FileType.EPISODE },
      });

      await forEachSeries(torrents, (torrent) =>
        this.transmissionService.removeTorrentAndFiles(torrent.torrentHash)
      );

      await torrentDAO.remove(torrents);
    }

    await tvEpisodeDAO.save({
      id: episodeId,
      state: DownloadableMediaState.DOWNLOADING,
    });
  }

  private async replaceMovie(movieId: number, manager: EntityManager) {
    const movieDAO = manager!.getCustomRepository(MovieDAO);
    const torrentDAO = manager!.getCustomRepository(TorrentDAO);

    const movie = await movieDAO.findOneOrFail({ id: movieId });

    if (movie.state !== DownloadableMediaState.MISSING) {
      this.logger.info('movie already downloaded, removing existing files');

      const torrents = await torrentDAO.find({
        where: { resourceId: movieId, resourceType: FileType.MOVIE },
      });

      await forEachSeries(torrents, (torrent) =>
        this.transmissionService.removeTorrentAndFiles(torrent.torrentHash)
      );

      await torrentDAO.remove(torrents);
    }

    await movieDAO.save({
      id: movieId,
      state: DownloadableMediaState.DOWNLOADING,
    });
  }

  private enrichMovie = async (movie: Movie) => {
    const tmdbResult = await this.tmdbService
      .getMovie(movie.tmdbId)
      .then(this.tmdbService.mapMovie);
    return { ...tmdbResult, ...movie, title: tmdbResult.title };
  };

  private enrichTVShow = async (
    tvShow: TVShow,
    params?: { language: string }
  ) => {
    const tmdbResult = await this.tmdbService
      .getTVShow(tvShow.tmdbId, params)
      .then(this.tmdbService.mapTVShow);
    return { ...tmdbResult, ...tvShow, title: tmdbResult.title };
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
