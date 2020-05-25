import axios from 'axios';
import getRedirects from 'lib-get-redirects';
import { Inject, Injectable } from '@nestjs/common';
import { WINSTON_MODULE_PROVIDER } from 'nest-winston';
import { Logger } from 'winston';
import { Transmission } from 'transmission-client';
import { DeepPartial, TransactionManager, EntityManager } from 'typeorm';

import { Torrent } from 'src/entities/torrent.entity';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';
import { LazyTransaction } from 'src/utils/lazy-transaction';

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

  @LazyTransaction()
  public async addTorrentURL(
    {
      url,
      torrentAttributes,
    }: { url: string; torrentAttributes: DeepPartial<Torrent> },
    @TransactionManager() manager: EntityManager | null
  ) {
    const torrentDAO = manager!.getCustomRepository(TorrentDAO);

    this.logger.info('start download torrent from url', torrentAttributes);
    const transmissionTorrent = await this.addURL(url);

    this.logger.info('torrent download started', torrentAttributes);
    const torrent = await torrentDAO.save({
      ...torrentAttributes,
      torrentHash: transmissionTorrent.hashString,
    });

    return torrent;
  }

  private async addURL(url: string) {
    if (url.startsWith('magnet')) {
      return this.client.addMagnet(url, {});
    }

    try {
      // we try to follow redirects from jackett before
      // it might end up to a magnet or a .torrent file
      await getRedirects(url);
      return this.handleTorrentFile(url);
    } catch (error) {
      // redirected to a magnet uri, start it as magnet
      if (error?.options?.uri?.startsWith('magnet')) {
        return this.client.addMagnet(error.options.uri, {});
      }
      // not handled error, throw
      throw error;
    }
  }

  private async handleTorrentFile(url: string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return this.client.addBase64(base64);
  }
}
