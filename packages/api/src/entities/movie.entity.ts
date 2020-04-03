import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { DownloadableMediaState } from 'src/app.dto';

@Entity()
export class Movie {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('int', { unique: true })
  public tmdbId!: number;

  @Column('varchar')
  public englishTitle!: string;

  @Column('varchar')
  public originalTitle!: string;

  @Column('varchar', { default: DownloadableMediaState.MISSING })
  public state: DownloadableMediaState = DownloadableMediaState.MISSING;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
