import { ObjectType, Field } from '@nestjs/graphql';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
  Index,
  OneToMany,
} from 'typeorm';

import { DownloadableMediaState } from 'src/app.dto';
import { formatNumber } from 'src/utils/format-number';

import { TVSeason } from './tvseason.entity';
import { TVShow } from './tvshow.entity';
import { File } from './file.entity';

@Entity()
@Unique(['episodeNumber', 'seasonNumber', 'tvShow'])
@ObjectType()
export class TVEpisode {
  @Field()
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column('int')
  public episodeNumber!: number;

  @Field()
  @Column('int')
  public seasonNumber!: number;

  @Field((_type) => DownloadableMediaState)
  @Index()
  @Column('varchar', { default: DownloadableMediaState.SEARCHING })
  public state: DownloadableMediaState = DownloadableMediaState.SEARCHING;

  @Column('int')
  public seasonId!: number;

  @ManyToOne((_type) => TVSeason, (season) => season.episodes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  public season!: TVSeason;

  @Column('int')
  public tvShowId!: number;

  @Field((_type) => TVShow)
  @ManyToOne((_type) => TVShow, (tvshow) => tvshow.episodes, {
    nullable: false,
    onDelete: 'CASCADE',
  })
  public tvShow!: TVShow;

  @OneToMany((_type) => File, (file) => file.tvEpisode)
  public files!: File[];

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;

  public get title() {
    const episodeNb = formatNumber(this.episodeNumber);
    return this.season?.title
      ? `${this.season.title} - Episode ${episodeNb}`
      : `Episode ${episodeNb}`;
  }
}
