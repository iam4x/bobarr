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
  public tvShow!: TVShow;

  @OneToMany((_type) => TVEpisode, (episode) => episode.season, {
    onDelete: 'CASCADE',
  })
  public episodes!: TVEpisode[];

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
