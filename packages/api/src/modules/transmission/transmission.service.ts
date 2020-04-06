import axios from 'axios';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Transmission } from 'transmission-client';
import { DeepPartial } from 'typeorm';

import { Torrent } from 'src/entities/torrent.entity';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';

@Injectable()
export class TransmissionService {
  private client = new Transmission({ host: 'transmission' });

  public constructor(
    @Inject(WINSTON_MODULE_PROVIDER) private logger: Logger,
    private readonly torrentDAO: TorrentDAO
  ) {
    this.logger = logger.child({ context: 'TransmissionService' });
  }

  public removeTorrentAndFiles(torrentHash: string) {
    return this.client.remove(torrentHash, true);
  }

  public async getResourceTorrent(torrentAttributes: DeepPartial<Torrent>) {
    const torrent = await this.torrentDAO.findOneOrFail(torrentAttributes);
    const transmissionTorrent = await this.getTorrent(torrent.torrentHash);
    return { ...torrent, transmissionTorrent };
  }

  public getTorrent(torrentHash: string) {
    return this.client
      .get(torrentHash)
      .then(({ torrents: [torrent] }) => torrent);
  }

  public async addTorrentURL(
    url: string,
    torrentAttributes: DeepPartial<Torrent>
  ) {
    this.logger.info('start download torrent from url', torrentAttributes);
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    const transmissionTorrent = await this.client.addBase64(base64);
    this.logger.info('torrent download started', torrentAttributes);

    const torrent = await this.torrentDAO.save({
      ...torrentAttributes,
      torrentHash: transmissionTorrent.hashString,
    });

    return torrent;
  }
}
