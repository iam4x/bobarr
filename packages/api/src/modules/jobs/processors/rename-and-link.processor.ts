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

import { MovieDAO } from 'src/entities/dao/movie.dao';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';

import { TransmissionService } from 'src/modules/transmission/transmission.service';
import { LibraryService } from 'src/modules/library/library.service';

@Processor(JobsQueue.RENAME_AND_LINK)
export class RenameAndLinkQueueProcessor {
  public constructor(
    private readonly movieDAO: MovieDAO,
    private readonly torrentDAO: TorrentDAO,
    private readonly transmissionService: TransmissionService,
    private readonly libraryService: LibraryService
  ) {}

  @Process(RenameAndLinkQueueProcessors.HANDLE_MOVIE)
  public async renameAndLinkMovie({
    data: { movieId },
  }: Job<{ movieId: number }>) {
    const movie = await this.libraryService.getMovie(movieId);
    const torrent = await this.torrentDAO.findOneOrFail({
      where: { resourceId: movie.id, resourceType: FileType.MOVIE },
    });
    const transmissionTorrent = await this.transmissionService.getTorrent(
      torrent.torrentHash
    );

    const year = dayjs(movie.releaseDate).format('YYYY');
    const folderName = `${movie.title} (${year})`;

    const torrentFiles = transmissionTorrent.files.map((file) => {
      const ext = path.extname(file.name);
      const next = [folderName, torrent.quality, torrent.tag.toUpperCase()]
        .filter((str) => str.toLowerCase() !== 'unknown')
        .join(' ');
      return { original: file.name, next: `${next}${ext}` };
    });

    const newFolder = path.resolve(
      __dirname,
      '../../../../../library/movies/',
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
}
