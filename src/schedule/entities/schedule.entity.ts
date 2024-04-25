import { Data } from "aws-sdk/clients/firehose";
import { IsNumber } from "class-validator";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";
import { User } from "../../user/entities/user.entity";
@Entity({
    name: 'schedule',
  })
export class Schedule {
    @PrimaryGeneratedColumn()
    id: string

    @Column()
    title: string

    @Column()
    content: string

    
    @Column({ unsigned: true })
    userId: number;

    @Column({type: 'timestamp'})
    date: Date;

    @Column()
    Category: string

    @ManyToOne(() => User, (user) => user.schedule)
    user: User;


}
