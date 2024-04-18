import { IsString } from 'class-validator';
import {
  Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,OneToMany
} from 'typeorm';
import { Pet } from '../../pet/entities/pet.entity';

@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsString()
  @Column('varchar', { length: 20, nullable: false })
  name: string;

  @IsString()
  @Column('varchar', { length: 30, nullable: false })
  email: string;

  @IsString()
  @Column('varchar', { length: 10, select: false, nullable: false })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(type => Pet , (pet) => pet.user)
  pet : Pet[]
}