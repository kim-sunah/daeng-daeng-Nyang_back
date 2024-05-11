import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { IsString } from 'class-validator';
@Entity({
  name: 'chat',
})
@Index(['id', 'fromId'])
@Index(['id', 'toId'])
export class Chat {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;

  @Column('int', { unsigned: true })
  roomId: number;
  @Column('int', { unsigned: true })
  fromId: number;

  @Column('int', { unsigned: true })
  toId: number;

  @IsString()
  @Column()
  message: string;

  @CreateDateColumn()
  createdAt: Date;
}
