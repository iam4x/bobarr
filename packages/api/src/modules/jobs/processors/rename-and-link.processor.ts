import dayjs from 'dayjs';
import path from 'path';
import { childCommand } from 'child-command';
import { oneLine } from 'common-tags';
import { Processor, Process } from '@nestjs/bull';
import { mapSeries } from 'p-iteration';
import { Job } from 'bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import { LIBRARY_CONFIG } from 'src/config';

import {
  JobsQueue,
  FileType,
  DownloadableMediaState,
  RenameAndLinkQueueProcessors,
  ParameterKey,
  OrganizeLibraryStrategy,
} from 'src/app.dto';

import allowedExtensions from 'src/utils/allowed-file-extensions.json';
import { formatNumber } from 'src/utils/format-number';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';

import { TransmissionService } from 'src/modules/transmission/transmission.service';
import { LibraryService } from 'src/modules/library/library.service';
import { ParamsService } from 'src/modules/params/params.service';

@Processor(JobsQueue.RENAME_AND_LINK)
export class RenameAndLinkProcessor {
  // eslint-disable-next-line max-params
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly movieDAO: MovieDAO,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly tvEpisodeDAO: TVEpisodeDAO,
    private readonly torrentDAO: TorrentDAO,
    private readonly transmissionService: TransmissionService,
    private readonly libraryService: LibraryService,
    private readonly paramsService: ParamsService
  ) {
    this.logger = this.logger.child({ context: 'RenameAndLinkProcessor' });
  }

  private getOrganizeStrategyCommand(strategy: OrganizeLibraryStrategy) {
    switch (strategy) {
      case OrganizeLibraryStrategy.LINK:
        return 'ln -s';
      case OrganizeLibraryStrategy.MOVE:
        return 'mv';
      case OrganizeLibraryStrategy.COPY:
        return 'cp -R';
      default: {
        throw new Error('unknown strategy');
      }
    }
  }

  @Process(RenameAndLinkQueueProcessors.HANDLE_MOVIE)
  public async renameAndLinkMovie(job: Job<{ movieId: number }>) {
    const { movieId } = job.data;
    this.logger.info('start rename and link movie', { movieId });

    const organizeStrategy = (await this.paramsService.get(
      ParameterKey.ORGANIZE_LIBRARY_STRATEGY
    )) as OrganizeLibraryStrategy;

    const movie = await this.libraryService.getMovie(movieId);
    const torrent = await this.transmissionService.getResourceTorrent({
      resourceId: movie.id,
      resourceType: FileType.MOVIE,
    });

    const year = dayjs(movie.releaseDate).format('YYYY');
    const folderName = `${movie.title} (${year})`;

    const nextName = [folderName, torrent.quality, torrent.tag.toUpperCase()]
      .filter((str) => str.toLowerCase() !== 'unknown')
      .join(' ');

    const torrentFiles = torrent.transmissionTorrent.files.reduce<
      Array<{ original: string; next: string }>
    >((results, file) => {
      const ext = path.extname(file.name);
      const isAllowedExt = allowedExtensions.includes(ext.replace(/^\./, ''));
      const alreadyProcessed = results.some((_) => _.original === file.name);

      if (isAllowedExt && !alreadyProcessed) {
        // find files with same extension, we will pick the largest file
        // which should be the movie and not a sample
        const sameExtensionFiles = torrent.transmissionTorrent.files.filter(
          (_) => _.name.endsWith(ext)
        );

        // we have more than one file, we will pick the largest
        if (sameExtensionFiles.length > 1) {
          const maxSizeFile = sameExtensionFiles.reduce((result, _) =>
            result && result.length > _.length ? result : _
          );

          return [
            ...results,
            { original: maxSizeFile.name, next: `${nextName}${ext}` },
          ];
        }

        return [...results, { original: file.name, next: `${nextName}${ext}` }];
      }

      if (!isAllowedExt && !alreadyProcessed) {
        const [fileName] = file.name.split('/').reverse();
        return [...results, { original: file.name, next: fileName }];
      }

      return results;
    }, []);

    const newFolder = path.resolve(
      __dirname,
      `../../../../../../library/${LIBRARY_CONFIG.moviesFolderName}/`,
      folderName
    );

    await childCommand(`mkdir -p "${newFolder}"`);
    await mapSeries(torrentFiles, async (torrentFile) => {
      await childCommand(
        oneLine`
            cd "${newFolder}" &&
            ${this.getOrganizeStrategyCommand(organizeStrategy)}
              "../../downloads/complete/${torrentFile.original}"
              "${torrentFile.next}"
          `
      );
    });

    if (organizeStrategy === OrganizeLibraryStrategy.MOVE) {
      await this.transmissionService.removeTorrentAndFiles(torrent.torrentHash);
      await this.torrentDAO.remove(torrent);
    }

    await this.movieDAO.save({
      id: movieId,
      state: DownloadableMediaState.PROCESSED,
    });

    this.logger.info('finish rename and link movie', { movieId });
  }

  @Process(RenameAndLinkQueueProcessors.HANDLE_EPISODE)
  public async renameAndLinkEpisode(job: Job<{ episodeId: number }>) {
    const { episodeId } = job.data;
    this.logger.info('start rename and link episode', { episodeId });

    const organizeStrategy = (await this.paramsService.get(
      ParameterKey.ORGANIZE_LIBRARY_STRATEGY
    )) as OrganizeLibraryStrategy;

    const episode = await this.tvEpisodeDAO.findOneOrFail({
      where: { id: episodeId },
      relations: ['season', 'season.tvShow'],
    });

    const tvShow = await this.libraryService.getTVShow(
      episode.season.tvShow.id,
      { language: 'en' }
    );

    const torrent = await this.transmissionService.getResourceTorrent({
      resourceId: episode.id,
      resourceType: FileType.EPISODE,
    });

    const seasonNb = formatNumber(episode.season.seasonNumber);
    const seasonFolder = path.resolve(
      __dirname,
      `../../../../../../library/${LIBRARY_CONFIG.tvShowsFolderName}/`,
      tvShow.title,
      `Season ${seasonNb}`
    );

    const torrentFiles = torrent.transmissionTorrent.files
      .filter((file) => {
        const ext = path.extname(file.name);
        return allowedExtensions.includes(ext.replace(/^\./, ''));
      })
      .map((file) => {
        const ext = path.extname(file.name);
        const next = [
          tvShow.title,
          `S${seasonNb}E${formatNumber(episode.episodeNumber)}`,
          `${torrent.quality} [${torrent.tag.toUpperCase()}]`,
        ].join(' - ');
        return { original: file.name, next: `${next}${ext}` };
      });

    await childCommand(`mkdir -p "${seasonFolder}"`);
    await mapSeries(torrentFiles, async (torrentFile) => {
      await childCommand(
        oneLine`
          cd "${seasonFolder}" &&
          ${this.getOrganizeStrategyCommand(organizeStrategy)}
            "../../../downloads/complete/${torrentFile.original}"
            "${torrentFile.next}"
        `
      );
    });

    if (organizeStrategy === OrganizeLibraryStrategy.MOVE) {
      await this.transmissionService.removeTorrentAndFiles(torrent.torrentHash);
      await this.torrentDAO.remove(torrent);
    }

    await this.tvEpisodeDAO.save({
      id: episode.id,
      state: DownloadableMediaState.PROCESSED,
    });

    this.logger.info('finish rename and link episode', { episodeId });
  }

  @Process(RenameAndLinkQueueProcessors.HANDLE_SEASON)
  public async renameAndLinkSeason(job: Job<{ seasonId: number }>) {
    const { seasonId } = job.data;
    this.logger.info('start rename and link season', { seasonId });

    const organizeStrategy = (await this.paramsService.get(
      ParameterKey.ORGANIZE_LIBRARY_STRATEGY
    )) as OrganizeLibraryStrategy;

    const season = await this.tvSeasonDAO.findOneOrFail({
      where: { id: seasonId },
      relations: ['tvShow', 'episodes'],
    });

    const tvShow = await this.libraryService.getTVShow(season.tvShow.id, {
      language: 'en',
    });

    const torrent = await this.transmissionService.getResourceTorrent({
      resourceId: season.id,
      resourceType: FileType.SEASON,
    });

    const seasonNb = formatNumber(season.seasonNumber);
    const seasonFolder = path.resolve(
      __dirname,
      `../../../../../../library/${LIBRARY_CONFIG.tvShowsFolderName}/`,
      tvShow.title,
      `Season ${seasonNb}`
    );

    const torrentFiles = torrent.transmissionTorrent.files.reduce(
      (
        results: Array<{ original: string; ext: string; episodeNb: number }>,
        file
      ) => {
        const ext = path.extname(file.name);
        const fileName = path.basename(file.name.toUpperCase());

        const [, episodeNb1] = /S\d+ ?E(\d+)/.exec(fileName) || []; // Foobar_S01E01.mkv
        const [, episodeNb2] = /\d+X(\d+)/.exec(fileName) || []; // Foobar_1x01.mkv

        const episodeNb = episodeNb1 || episodeNb2;

        if (episodeNb && allowedExtensions.includes(ext.replace(/^\./, ''))) {
          return [
            ...results,
            { original: file.name, ext, episodeNb: parseInt(episodeNb, 10) },
          ];
        }

        return results;
      },
      []
    );

    if (torrentFiles.length === 0) {
      this.logger.error('did not find any files in torrent');
      this.logger.error('here are the raw torrent files (before filter)', {
        files: torrent.transmissionTorrent.files,
      });

      throw new Error('could not find any files in torrent');
    }

    await childCommand(`mkdir -p "${seasonFolder}"`);
    await mapSeries(torrentFiles, async (file) => {
      const newName = [
        tvShow.title,
        `S${seasonNb}E${formatNumber(file.episodeNb)}`,
        `${torrent.quality} [${torrent.tag.toUpperCase()}]`,
      ].join(' - ');

      await childCommand(
        oneLine`
          cd "${seasonFolder}" &&
          ${this.getOrganizeStrategyCommand(organizeStrategy)}
          "../../../downloads/complete/${file.original}"
          "${newName}${file.ext}"
        `
      );
    });

    if (organizeStrategy === OrganizeLibraryStrategy.MOVE) {
      await this.transmissionService.removeTorrentAndFiles(torrent.torrentHash);
      await this.torrentDAO.remove(torrent);
    }

    await this.tvEpisodeDAO.save(
      season.episodes
        .filter((episode) =>
          torrentFiles.some((file) => file.episodeNb === episode.episodeNumber)
        )
        .map((episode) => ({
          id: episode.id,
          state: DownloadableMediaState.PROCESSED,
        }))
    );

    await this.tvSeasonDAO.save({
      id: season.id,
      state: DownloadableMediaState.PROCESSED,
    });

    this.logger.info('finsh rename and link season', { seasonId });
  }
}
