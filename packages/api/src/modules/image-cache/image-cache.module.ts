import { Module } from '@nestjs/common';
import { ImageCacheController } from './image-cache.controller';

@Module({ imports: [], controllers: [ImageCacheController] })
export class ImageCacheModule {}
