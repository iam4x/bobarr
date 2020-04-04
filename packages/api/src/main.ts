import { NestFactory } from '@nestjs/core';
import { UI } from 'bull-board';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/admin/queues', UI);
  await app.listen(4000);
}
bootstrap();
