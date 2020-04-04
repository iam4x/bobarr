import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { DB_CONFIG } from './config';

import { LibraryModule } from './library/library.module';
import { ParamsModule } from './params/params.module';
import { TMDBModule } from './tmdb/tmdb.module';

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
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
