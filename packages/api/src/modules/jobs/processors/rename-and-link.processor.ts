import dayjs from 'dayjs';
import path from 'path';
import { childCommand } from 'child-command';
import { oneLine } from 'common-tags';
import { Processor, Process } from '@nestjs/bull';
import { mapSeries } from 'p-iteration';
import { Job } from 'bull';

import {
  JobsQueue,
  FileType,
  DownloadableMediaState,
  RenameAndLinkQueueProcessors,
} from 'src/app.dto';

import allowedExtensions from 'src/utils/allowed-file-extensions.json';
import { formatNumber } from 'src/utils/format-number';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';

import { TransmissionService } from 'src/modules/transmission/transmission.service';
import { LibraryService } from 'src/modules/library/library.service';

@Processor(JobsQueue.RENAME_AND_LINK)
export class RenameAndLinkQueueProcessor {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly tvEpisodeDAO: TVEpisodeDAO,
    private readonly transmissionService: TransmissionService,
    private readonly libraryService: LibraryService
  ) {}

  @Process(RenameAndLinkQueueProcessors.HANDLE_MOVIE)
  public async renameAndLinkMovie(job: Job<{ movieId: number }>) {
    const { movieId } = job.data;

    const movie = await this.libraryService.getMovie(movieId);
    const torrent = await this.transmissionService.getResourceTorrent({
      resourceId: movie.id,
      resourceType: FileType.MOVIE,
    });

    const year = dayjs(movie.releaseDate).format('YYYY');
    const folderName = `${movie.title} (${year})`;

    const torrentFiles = torrent.transmissionTorrent.files.map((file) => {
      const ext = path.extname(file.name);
      const next = [folderName, torrent.quality, torrent.tag.toUpperCase()]
        .filter((str) => str.toLowerCase() !== 'unknown')
        .join(' ');
      return { original: file.name, next: `${next}${ext}` };
    });

    const newFolder = path.resolve(
      __dirname,
      '../../../../../../library/movies/',
      folderName
    );

    await childCommand(`mkdir -p "${newFolder}"`);
    await mapSeries(torrentFiles, async (torrentFile) => {
      await childCommand(
        oneLine`
          cd "${newFolder}" &&
          ln -s
            "../../downloads/complete/${torrentFile.original}"
            "${torrentFile.next}"
        `
      );
    });

    await this.movieDAO.save({
      id: movieId,
      state: DownloadableMediaState.PROCESSED,
    });
  }

  @Process(RenameAndLinkQueueProcessors.HANDLE_EPISODE)
  public async renameAndLinkEpisode(job: Job<{ episodeId: number }>) {
    const { episodeId } = job.data;

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
      '../../../../../../library/tvshows/',
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
          ln -s
            "../../../downloads/complete/${torrentFile.original}"
            "${torrentFile.next}"
        `
      );
    });

    await this.tvEpisodeDAO.save({
      id: episode.id,
      state: DownloadableMediaState.PROCESSED,
    });
  }

  @Process(RenameAndLinkQueueProcessors.HANDLE_SEASON)
  public async renameAndLinkSeason(job: Job<{ seasonId: number }>) {
    const { seasonId } = job.data;

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
      '../../../../../../library/tvshows/',
      tvShow.title,
      `Season ${seasonNb}`
    );

    const torrentFiles = torrent.transmissionTorrent.files
      .filter((file) => {
        const ext = path.extname(file.name);
        const [, episodeNb] = /S\d+E(\d+)/.exec(file.name.toUpperCase()) || [];
        return episodeNb && allowedExtensions.includes(ext.replace(/^\./, ''));
      })
      .map((file) => {
        const ext = path.extname(file.name);
        const [, episodeNb] = /S\d+E(\d+)/.exec(file.name.toUpperCase()) || [];
        return { original: file.name, ext, episodeNb: parseInt(episodeNb, 10) };
      });

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
          ln -s
          "../../../downloads/complete/${file.original}"
          "${newName}${file.ext}"
        `
      );
    });

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
  }
}
