import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';

import { TVSeason } from './tvseason.entity';
import { TVShow } from './tvshow.entity';
import { DownloadableMediaState } from 'src/app.dto';

@Entity()
export class TVEpisode {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('int')
  public episodeNumber!: number;

  @Column('int')
  public seasonNumber!: number;

  @Column('varchar', { default: DownloadableMediaState.MISSING })
  public state: DownloadableMediaState = DownloadableMediaState.MISSING;

  @ManyToOne((_type) => TVSeason, (season) => season.episodes, {
    onDelete: 'CASCADE',
  })
  public season!: TVSeason;

  @ManyToOne((_type) => TVShow, (tvshow) => tvshow.episodes, {
    onDelete: 'CASCADE',
  })
  public tvShow!: TVShow;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
