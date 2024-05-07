import { Data } from 'aws-sdk/clients/firehose';
import { IsNumber } from 'class-validator';
import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Pet } from 'src/pet/entities/pet.entity';

export enum categorys {
  HOSPITAL = '병원',
  WALK = '산책',
  VACCINATION = '예방접종',
}

@Entity({
  name: 'schedule',
})
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  content: string;

  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  petId: number;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column({ type: 'varchar', nullable: false })
  place: string;

  @Column()
  location: string;

  @Column()
  category: categorys;

  @ManyToOne(() => User, (user) => user.schedule)
  user: User;

  @ManyToOne(() => Pet, (pet) => pet.schedule)
  pet: Pet;
}
