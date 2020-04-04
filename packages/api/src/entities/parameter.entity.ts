import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

import { ParameterKey } from 'src/app.dto';

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('varchar')
  public key!: ParameterKey;

  @Column('varchar')
  public value!: string;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
