import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { DB_CONFIG } from './config';

import { LibraryModule } from 'src/modules/library/library.module';
import { ParamsModule } from 'src/modules/params/params.module';
import { TMDBModule } from 'src/modules/tmdb/tmdb.module';
import { JackettModule } from 'src/modules/jackett/jackett.module';
import { JobsModule } from 'src/modules/jobs/jobs.module';
import { TransmissionModule } from 'src/modules/transmission/transmission.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_CONFIG),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      introspection: true,
      playground: true,
    }),
    ParamsModule,
    LibraryModule,
    TMDBModule,
    JackettModule,
    JobsModule,
    TransmissionModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
