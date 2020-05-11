import { ObjectType, Field } from '@nestjs/graphql';

import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  UpdateDateColumn,
  CreateDateColumn,
} from 'typeorm';
import { Entertainment } from 'src/modules/tmdb/tmdb.dto';

@Entity()
@ObjectType()
export class Quality {
  @Field()
  @PrimaryGeneratedColumn()
  public id!: number;

  @Field()
  @Column('varchar')
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

  @Field((_type) => Entertainment)
  @Column({ type: 'enum', enum: Entertainment, default: Entertainment.Movie })
  public type!: Entertainment;
}
