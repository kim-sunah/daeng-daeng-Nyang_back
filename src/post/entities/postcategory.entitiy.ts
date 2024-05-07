
import { IsNumber, IsString } from 'class-validator';
import { Upload } from 'src/uploads/entities/upload.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Post } from './post.entity';

@Entity({
  name: 'postcategory',
})

export class Postcategory {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  
  @Column()
  category : string;

  @Column({ unsigned: true })
  postId : number;

  @ManyToOne(() => Post, (post) => post.postcategory)
  post: Post;

  

}
