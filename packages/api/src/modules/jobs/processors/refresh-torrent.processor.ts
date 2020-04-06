import { forEachSeries } from 'p-iteration';
import { Processor, Process, InjectQueue } from '@nestjs/bull';
import { Queue } from 'bull';
import { Inject } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';

import {
  JobsQueue,
  DownloadableMediaState,
  FileType,
  RenameAndLinkQueueProcessors,
} from 'src/app.dto';

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';
import { TVSeasonDAO } from 'src/entities/dao/tvseason.dao';
import { TVEpisodeDAO } from 'src/entities/dao/tvepisode.dao';

import { TransmissionService } from 'src/modules/transmission/transmission.service';

@Processor(JobsQueue.REFRESH_TORRENT)
export class RefreshTorrentProcessor {
  // eslint-disable-next-line max-params
  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    @InjectQueue(JobsQueue.RENAME_AND_LINK)
    private readonly renameAndLinkQueue: Queue,
    private readonly movieDAO: MovieDAO,
    private readonly torrentDAO: TorrentDAO,
    private readonly transmissionService: TransmissionService,
    private readonly tvSeasonDAO: TVSeasonDAO,
    private readonly tvEpisodeDAO: TVEpisodeDAO
  ) {
    this.logger = logger.child({ context: 'RefreshTorrentProcessor' });
  }

  @Process()
  public async refreshTorrents() {
    this.logger.info('start refresh torrent status');

    const donwloadingMovies = await this.movieDAO.find({
      where: { state: DownloadableMediaState.DOWNLOADING },
    });

    await forEachSeries(donwloadingMovies, (movie) =>
      this.checkTorrent({ resourceId: movie.id, resourceType: FileType.MOVIE })
    );

    const downloadingSeasons = await this.tvSeasonDAO.find({
      where: { state: DownloadableMediaState.DOWNLOADING },
    });

    await forEachSeries(downloadingSeasons, (season) =>
      this.checkTorrent({
        resourceId: season.id,
        resourceType: FileType.SEASON,
      })
    );

    const downloadEpisodes = await this.tvEpisodeDAO.find({
      where: { state: DownloadableMediaState.DOWNLOADING },
    });

    await forEachSeries(downloadEpisodes, (episode) =>
      this.checkTorrent({
        resourceId: episode.id,
        resourceType: FileType.EPISODE,
      })
    );

    this.logger.info('finish refresh torrent status');
  }

  private async checkTorrent({
    resourceId,
    resourceType,
  }: {
    resourceId: number;
    resourceType: FileType;
  }) {
    this.logger.info('refresh torrent status', { resourceId, resourceType });

    const torrent = await this.torrentDAO.findOneOrFail({
      where: { resourceId, resourceType },
    });

    const transmissionTorrent = await this.transmissionService.getTorrent(
      torrent.torrentHash
    );

    const isComplete = transmissionTorrent.percentDone === 1;

    this.logger.info(
      isComplete ? 'torrent download finish' : 'torrent download in progress',
      { resourceId, resourceType }
    );

    if (isComplete) {
      if (resourceType === FileType.MOVIE) {
        await this.movieDAO.save({
          id: resourceId,
          state: DownloadableMediaState.DOWNLOADED,
        });
        await this.renameAndLinkQueue.add(
          RenameAndLinkQueueProcessors.HANDLE_MOVIE,
          { movieId: resourceId }
        );
      }

      if (resourceType === FileType.SEASON) {
        await this.tvSeasonDAO.save({
          id: resourceId,
          state: DownloadableMediaState.DOWNLOADED,
        });
        await this.renameAndLinkQueue.add(
          RenameAndLinkQueueProcessors.HANDLE_SEASON,
          { seasonId: resourceId }
        );
      }

      if (resourceType === FileType.EPISODE) {
        await this.tvEpisodeDAO.save({
          id: resourceId,
          state: DownloadableMediaState.DOWNLOADED,
        });
        await this.renameAndLinkQueue.add(
          RenameAndLinkQueueProcessors.HANDLE_EPISODE,
          { episodeId: resourceId }
        );
      }
    }
  }
}
