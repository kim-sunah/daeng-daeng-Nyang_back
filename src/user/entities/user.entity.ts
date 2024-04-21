import { IsString } from 'class-validator';
import {
  Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn,OneToMany, Index
} from 'typeorm';
import { Pet } from '../../pet/entities/pet.entity';
import { Role } from '../types/userRole.type';
import { Post } from 'src/post/entities/post.entity';

@Index('email', ['email'], { unique: true })
@Entity({
  name: 'user',
})
export class User {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @IsString()
  @Column('varchar', { length: 20, nullable: false })
  name: string;

  @Column({ type: 'varchar', unique: true, nullable: false })
  email: string;

  @Column({ type: 'varchar', select: false, nullable: false })
  password: string;

  @Column({ type: 'enum', enum: Role, default: Role.User })
  role: Role;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @OneToMany(type => Pet , (pet) => pet.user)
  pets : Pet[]

  @OneToMany(() => Post, (posts) => posts.userId)
  posts: Post[];
}