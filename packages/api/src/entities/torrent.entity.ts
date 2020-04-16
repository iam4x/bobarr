import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { FileType } from 'src/app.dto';

@Entity()
export class Torrent {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  public torrentHash!: string;

  @Index()
  @Column('varchar')
  public resourceType!: FileType;

  @Column('varchar', { default: 'unknown' })
  public quality!: string;

  @Column('varchar', { default: 'unknown' })
  public tag!: string;

  @Index()
  @Column('int')
  public resourceId!: number;

  @Column('boolean', { default: false })
  public completed: boolean = false;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
