import { Resolver, Query, Args } from '@nestjs/graphql';
import { map } from 'p-iteration';

import { TorrentDAO } from 'src/entities/dao/torrent.dao';

import { TorrentStatus, GetTorrentStatusInput } from './transmission.dto';
import { TransmissionService } from './transmission.service';

@Resolver()
export class TransmissionResolver {
  public constructor(
    private readonly torrentDAO: TorrentDAO,
    private readonly transmissionService: TransmissionService
  ) {}

  @Query((_returns) => [TorrentStatus])
  public getTorrentStatus(
    @Args('torrents', { type: () => [GetTorrentStatusInput] })
    torrents: GetTorrentStatusInput[]
  ) {
    return map(torrents, async ({ resourceId, resourceType }) => {
      const torrent = await this.torrentDAO.findOneOrFail({
        where: { resourceId, resourceType },
      });

      const torrentStatus = await this.transmissionService.getTorrent(
        torrent.torrentHash
      );

      return { ...torrentStatus, resourceId, resourceType };
    });
  }
}
