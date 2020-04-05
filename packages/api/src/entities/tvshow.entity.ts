import { ObjectType, Field } from '@nestjs/graphql';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';

import { TVSeason } from './tvseason.entity';
import { TVEpisode } from './tvepisode.entity';

@Entity()
@ObjectType()
export class TVShow {
  @Field()
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column('int', { unique: true })
  public tmdbId!: number;

  @Field()
  @Column('varchar')
  public title!: string;

  @OneToMany((_type) => TVSeason, (season) => season.tvshow, {
    onDelete: 'CASCADE',
  })
  public seasons!: TVSeason[];

  @OneToMany((_type) => TVEpisode, (episode) => episode.tvshow, {
    onDelete: 'CASCADE',
  })
  public episodes!: TVEpisode[];

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
