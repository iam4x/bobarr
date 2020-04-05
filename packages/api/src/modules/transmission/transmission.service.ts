import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { Transmission } from 'transmission-client';
import { DeepPartial } from 'typeorm';
import { Torrent } from 'src/entities/torrent.entity';
import { TorrentDAO } from 'src/entities/dao/torrent.dao';

@Injectable()
export class TransmissionService {
  private client = new Transmission({ host: 'transmission' });

  public constructor(private readonly torrentDAO: TorrentDAO) {}

  public removeTorrentAndFiles(torrentHash: string) {
    return this.client.remove(torrentHash, true);
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
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');

    const transmissionTorrent = await this.client.addBase64(base64);
    const torrent = await this.torrentDAO.save({
      ...torrentAttributes,
      torrentHash: transmissionTorrent.hashString,
    });

    return torrent;
  }
}
