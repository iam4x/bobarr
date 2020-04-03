import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { DB_CONFIG } from './config';

@Module({
  imports: [TypeOrmModule.forRoot(DB_CONFIG)],
  controllers: [],
  providers: [],
})
export class AppModule {}
