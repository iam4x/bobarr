import { NestFactory } from '@nestjs/core';
import { WinstonModule } from 'nest-winston';
import { router as bullBoardMiddleware } from 'bull-board';
import * as bodyParser from 'body-parser';

import { AppModule } from './app.module';
import { winstonOptions } from './utils/winston-options';

async function bootstrap() {
  const logger = WinstonModule.createLogger(winstonOptions);
  const app = await NestFactory.create(AppModule, { logger });
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.use('/jobs', bullBoardMiddleware);
  await app.listen(4000);
}
bootstrap();
