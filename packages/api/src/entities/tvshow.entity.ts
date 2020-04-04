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
export class TVShow {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('int', { unique: true })
  public tmdbId!: number;

  @Column('varchar')
  public title!: string;

  @OneToMany((_type) => TVSeason, (season) => season.tvshow)
  public seasons!: TVSeason[];

  @OneToMany((_type) => TVEpisode, (episode) => episode.tvshow)
  public episodes!: TVEpisode[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
