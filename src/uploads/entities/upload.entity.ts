import { Post } from "src/post/entities/post.entity";
import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('upload')
export class Upload {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column('int', { unsigned: true })
    postId: number;

    @Column({ nullable: true })
    image: string;

    @ManyToOne(() => Post, (post) => post.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'postId' })
    post: Post;
}