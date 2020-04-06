import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  Unique,
} from 'typeorm';

import { TVSeason } from './tvseason.entity';
import { TVShow } from './tvshow.entity';
import { DownloadableMediaState } from 'src/app.dto';
import { formatNumber } from 'src/utils/format-number';

@Entity()
@Unique(['episodeNumber', 'seasonNumber', 'tvShow'])
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

  public get title() {
    const episodeNb = formatNumber(this.episodeNumber);
    return this.season?.title
      ? `${this.season.title} - Episode ${episodeNb}`
      : `Episode ${episodeNb}`;
  }
}
