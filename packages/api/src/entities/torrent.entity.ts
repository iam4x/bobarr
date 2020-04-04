import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { FileType } from 'src/app.dto';

@Entity()
export class Torrent {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('varchar')
  public torrentHash!: string;

  @Column('varchar')
  public resourceType!: FileType;

  @Column('varchar', { default: 'unknown' })
  public quality!: string;

  @Column('varchar', { default: 'unknown' })
  public tag!: string;

  @Column('int')
  public resourceId!: number;

  @Column('boolean', { default: false })
  public completed: boolean = false;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
