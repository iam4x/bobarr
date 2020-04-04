import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { Transmission } from 'transmission-client';

@Injectable()
export class TransmissionService {
  private client = new Transmission({ host: 'transmission' });

  public removeTorrentAndFiles(torrentHash: string) {
    return this.client.remove(torrentHash, true);
  }

  public getTorrent(torrentHash: string) {
    return this.client
      .get(torrentHash)
      .then(({ torrents: [torrent] }) => torrent);
  }

  public async addTorrentURL(url: string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return this.client.addBase64(base64);
  }
}
