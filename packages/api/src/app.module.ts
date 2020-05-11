import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { WinstonModule } from 'nest-winston';
import { TerminusModule } from '@nestjs/terminus';

import { DB_CONFIG } from './config';
import { winstonOptions } from './utils/winston-options';

import { LibraryModule } from 'src/modules/library/library.module';
import { ParamsModule } from 'src/modules/params/params.module';
import { TMDBModule } from 'src/modules/tmdb/tmdb.module';
import { JackettModule } from 'src/modules/jackett/jackett.module';
import { JobsModule } from 'src/modules/jobs/jobs.module';
import { TransmissionModule } from 'src/modules/transmission/transmission.module';
import { RedisModule } from 'src/modules/redis/redis.module';
import { HealthController } from 'src/modules/health/health.controller';
import { ImageCacheModule } from 'src/modules/image-cache/image-cache.module';
import { OMDBModule } from './modules/omdb/omdb.module';

@Module({
  imports: [
    WinstonModule.forRoot(winstonOptions),
    TypeOrmModule.forRoot(DB_CONFIG),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      introspection: true,
      playground: true,
    }),
    TerminusModule,
    ParamsModule,
    LibraryModule,
    TMDBModule,
    OMDBModule,
    JackettModule,
    JobsModule,
    TransmissionModule,
    RedisModule,
    ImageCacheModule,
  ],
  controllers: [HealthController],
  providers: [],
})
export class AppModule {}
