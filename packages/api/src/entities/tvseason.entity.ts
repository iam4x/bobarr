import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
} from 'typeorm';

import { TVShow } from './tvshow.entity';
import { TVEpisode } from './tvepisode.entity';

@Entity()
export class TVSeason {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('int', { unique: true })
  public tmdbId!: number;

  @Column('int')
  public seasonNumber!: number;

  @ManyToOne((_type) => TVShow, (tvshow) => tvshow.seasons)
  public tvshow!: TVShow;

  @OneToMany((_type) => TVEpisode, (episode) => episode.season)
  public episodes!: TVEpisode[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
