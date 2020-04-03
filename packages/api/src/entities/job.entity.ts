import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
} from 'typeorm';

import { JobName } from 'src/app.dto';

@Entity()
export class Job {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('varchar')
  public name!: JobName;

  @Column('jsonb')
  public arguments!: Record<string, any>;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
