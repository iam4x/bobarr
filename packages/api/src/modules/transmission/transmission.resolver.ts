import { Resolver, Query, Args, Int } from '@nestjs/graphql';

import { FileType } from 'src/app.dto';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';

import { TorrentStatus } from './transmission.dto';
import { TransmissionService } from './transmission.service';

@Resolver()
export class TransmissionResolver {
  public constructor(
    private readonly torrentDAO: TorrentDAO,
    private readonly transmissionService: TransmissionService
  ) {}

  @Query((_returns) => TorrentStatus)
  public async getTorrentStatus(
    @Args('resourceId', { type: () => Int }) resourceId: number,
    @Args('resourceType', { type: () => FileType }) resourceType: FileType
  ) {
    const torrent = await this.torrentDAO.findOneOrFail({
      where: { resourceId, resourceType },
    });
    return this.transmissionService.getTorrent(torrent.torrentHash);
  }
}
