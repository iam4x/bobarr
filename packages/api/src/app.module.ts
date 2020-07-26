import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModuleOptions } from "@nestjs/typeorm/dist/interfaces/typeorm-options.interface";
import { WinstonModule } from 'nest-winston';
import { TerminusModule } from '@nestjs/terminus';
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

import config from './config';
import path from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: [
        path.resolve(__dirname, '../../../.env'),
        path.resolve(__dirname, '.env'),
      ],
      load: [config],
    }),
    WinstonModule.forRoot(winstonOptions),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => configService.get<TypeOrmModuleOptions>('database', {}),
      inject: [ConfigService],
    }),
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
