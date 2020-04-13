import { ObjectType, Field } from '@nestjs/graphql';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';

@Entity()
@ObjectType()
export class Tag {
  @Field()
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column('varchar', { unique: true })
  public name!: string;

  @Field()
  @Column('int')
  public score!: number;

  @Field()
  @CreateDateColumn()
  public createdAt!: Date;

  @Field()
  @UpdateDateColumn()
  public updatedAt!: Date;
}
