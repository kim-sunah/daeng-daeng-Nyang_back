import {
  Index,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import { IsString } from 'class-validator';
import { User } from '../../user/entities/user.entity';

import {
  Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn
} from 'typeorm';
@Entity({
    name : 'pet'
})
@Index(['id', 'userId'])
export class Pet{
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    //RFID_CD번호
    @Column()
    rfidCd: String;

    @Column('int', { unsigned: true })
    userId: number;

    @Column('varchar', { length: 100, nullable: false  })
    profileImage: string;

    //동물등록번호
    @Column()
    dogRegNo : String;

    //개이름
    @IsString()
    @Column('varchar', { length: 20, nullable: false })
    dogNm: string;

    //성별
    @Column()
    sexNm: number;

    //중성화여부
    @Column()
    neuterYn : boolean;

    //품종
    @Column()
    kindNm :String;
  
    @IsString()
    @Column('varchar', { length: 10, select: false, nullable: false })
    password: string;
  
    @CreateDateColumn()
    createdAt: Date;
  
    @UpdateDateColumn()
    updatedAt: Date;
  
    @DeleteDateColumn()
    deletedAt?: Date;

    @ManyToOne(() => User, (user) => user.pets,{ onUpdate: 'CASCADE', onDelete: 'CASCADE' })
    @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
    user: User;
}