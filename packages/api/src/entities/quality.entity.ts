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
export class Quality {
  @Field()
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column('varchar', { unique: true })
  public name!: string;

  @Field((_type) => [String])
  @Column('simple-array')
  public match!: string[];

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
