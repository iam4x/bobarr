// eslint-disable-next-line import/no-extraneous-dependencies
import { Response } from 'express';

import os from 'os';
import path from 'path';
import axios from 'axios';
import { promises as fs } from 'fs';

import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Query,
  Res,
} from '@nestjs/common';

@Controller('image-cache')
export class ImageCacheController {
  @Get()
  public async getFromCache(
    @Query('i') imageUrl: string,
    @Res() res: Response
  ) {
    if (!imageUrl) {
      throw new HttpException(
        'INVALID_IMAGE_URL',
        HttpStatus.UNPROCESSABLE_ENTITY
      );
    }

    const filePath = path.join(os.tmpdir(), '/bobarr-image-cache', imageUrl);

    try {
      await fs.stat(filePath);
      await fs.readFile(filePath);
    } catch (error) {
      const { data: buffer } = await axios.get(
        `https://image.tmdb.org/t/p/${imageUrl}`,
        {
          responseType: 'arraybuffer',
        }
      );

      await fs.mkdir(path.dirname(filePath), { recursive: true });
      await fs.writeFile(filePath, buffer);
    }

    return res.sendFile(filePath);
  }
}
