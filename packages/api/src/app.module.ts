import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GraphQLModule } from '@nestjs/graphql';

import { DB_CONFIG } from './config';
import { LibraryModule } from './library/library.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(DB_CONFIG),
    GraphQLModule.forRoot({
      autoSchemaFile: 'schema.gql',
      introspection: true,
      playground: true,
    }),
    LibraryModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
