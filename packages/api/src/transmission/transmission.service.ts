import axios from 'axios';
import { Injectable } from '@nestjs/common';
import { Transmission } from 'transmission-client';

@Injectable()
export class TransmissionService {
  private client = new Transmission({ host: 'transmission' });

  public async addTorrentURL(url: string) {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const base64 = Buffer.from(response.data, 'binary').toString('base64');
    return this.client.addBase64(base64);
  }
}
