import {
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { IsNumber, IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';

import {
  Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
import { Schedule } from '../../schedule/entities/schedule.entity';
@Entity({
    name : 'pet'
})
@Index(['id', 'userId'])
export class Pet{
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column('int', { unsigned: true })
    userId: number;

    @Column('varchar', { length: 100, nullable: false  })
    profileImage: string;

    //개이름
    @IsString()
    @Column('varchar', { length: 20, nullable: false })
    name : string;


    @IsNumber()
    @Column()
    age: string

    //성별
    @Column()
    gender:  String;

    //품종
    @Column()
    breed :String;

    @Column()
    birth : Date
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => User, (user) => user.pets,{ onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
    user: User;

    @OneToMany(() => Schedule, (schedule) => schedule.pet)
    schedule: Schedule[];
}