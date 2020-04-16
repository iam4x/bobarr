import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

import { ParameterKey } from 'src/app.dto';

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Index({ unique: true })
  @Column('varchar', { unique: true })
  public key!: ParameterKey;

  @Column('varchar')
  public value!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
