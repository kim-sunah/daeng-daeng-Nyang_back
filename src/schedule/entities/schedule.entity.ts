import { Data } from "aws-sdk/clients/firehose";
import { IsNumber } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
import { Pet } from "src/pet/entities/pet.entity";
@Entity({
  name: 'schedule',
})
export class Schedule {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  title: string

  @Column()
  content: string

  @Column({ unsigned: true })
  userId: number;

  @Column({ unsigned: true })
  petId: string;

  @Column({ type: 'timestamp' })
  date: Date;

  @Column()
  Category: string

  @ManyToOne(() => User, (user) => user.schedule)
  user: User;

  @ManyToOne(() => Pet, (pet) => pet.schedule)
  pet: Pet;

}
