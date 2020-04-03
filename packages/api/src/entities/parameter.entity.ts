import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Parameter {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column('varchar')
  public key!: string;

  @Column('jsonb')
  public value!: Record<string, any>;

  @CreateDateColumn()
  public createdAt!: Date;

  @UpdateDateColumn()
  public updatedAt!: Date;
}
