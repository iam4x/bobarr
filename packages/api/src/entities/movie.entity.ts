import { ObjectType, Field } from '@nestjs/graphql';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';

import { DownloadableMediaState } from 'src/app.dto';
import { File } from './file.entity';

@Entity()
@ObjectType()
export class Movie {
  @Field()
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Index()
  @Column('int', { unique: true })
  public tmdbId!: number;

  @Field()
  @Column('varchar')
  public title!: string;

  @Field((_type) => DownloadableMediaState)
  @Index()
  @Column('varchar', { default: DownloadableMediaState.SEARCHING })
  public state: DownloadableMediaState = DownloadableMediaState.SEARCHING;

  @OneToMany((_type) => File, (file) => file.movie)
  public files!: File[];

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
