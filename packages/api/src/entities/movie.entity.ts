import { ObjectType, Field } from '@nestjs/graphql';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { DownloadableMediaState } from 'src/app.dto';

@Entity()
@ObjectType()
export class Movie {
  @Field()
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column('int', { unique: true })
  public tmdbId!: number;

  @Field()
  @Column('varchar')
  public title!: string;

  @Field((_type) => DownloadableMediaState)
  @Column('varchar', { default: DownloadableMediaState.MISSING })
  public state: DownloadableMediaState = DownloadableMediaState.MISSING;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
