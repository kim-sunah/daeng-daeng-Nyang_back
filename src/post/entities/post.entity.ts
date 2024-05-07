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
import { Postcategory } from './postcategory.entitiy';

@Entity({
  name: 'post',
})
@Index(['id', 'userId'])
export class Post {
  @PrimaryGeneratedColumn({ unsigned: true })
  id: number;
  
  @IsNumber()
  @Column({ unsigned: true })
  userId: number;

  @Column({ default: 'https://lsh318204.cafe24.com/wp-content/uploads/kboard_attached/8/201906/5cf728d931fab7574308-600x338.jpg' })
  thumbnail: string;

  @IsString()
  @Column({ length: 50, nullable: false })
  title: string;

  @IsString()
  @Column({ length: 1000, nullable: false })
  content: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt?: Date;

  @ManyToOne(() => User, (user) => user.posts, { onUpdate: 'CASCADE', onDelete: 'CASCADE' })
  @JoinColumn([{ name: 'userId', referencedColumnName: 'id' }])
  user: User;

  @OneToMany(() => Upload, (upload) => upload.post)
  images: Upload[];

  @OneToMany(() => Postcategory , (postcategory) => postcategory.post)
  postcategory : Postcategory[]
  

}
