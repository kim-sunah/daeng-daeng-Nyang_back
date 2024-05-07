import { Cache } from 'cache-manager';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { basename, extname } from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { Upload } from 'src/uploads/entities/upload.entity';
import { STATUS_CODES } from 'http';
import { Postcategory } from './entities/postcategory.entitiy';

@Injectable()
export class PostService {
  constructor(
    @InjectRepository(Post) private postRepository: Repository<Post>,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
    private readonly configService: ConfigService,
    @InjectRepository(Upload) private UploadRepository: Repository<Upload>,
    @InjectRepository(Postcategory) private PostcategoryRepository: Repository<Postcategory>,
  ) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  async create(filename: string,file: Buffer,title: string,content: string, tags : string[], userId: number) {
    const ext = extname(filename);
    const baseName = basename(filename, ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`;
  
    try {
      await this.s3Client.send(new PutObjectCommand({ Bucket: 'sunah', Key: filenames, Body: file }));
      const post = await this.postRepository.save({userId, thumbnail: "https://sunah.s3.ap-northeast-2.amazonaws.com/" + filenames,title, content});
      
      if(post){
        tags.map(async(item) => (
          await this.PostcategoryRepository.save({postId : post.id , category : item})
        ))
      
      }
      return {message: "게시물 작성 성공" , STATUS_CODES : 200}
  } catch (err) {
      throw new BadRequestException("Error" , err)
      // Handle the error
    }
  }
  
  async findAll(page : number) {
    const articles = await this.postRepository.find({where: { deletedAt: null },select: ['id', 'title', 'updatedAt'], skip : (page - 1) * 16, take: 16 , relations : ["postcategory"]});
    const cachedArticles = await this.cacheManager.get('articles');
    if (cachedArticles === articles) {
      return cachedArticles;
    }
    await this.cacheManager.set('articles', articles);
    return articles;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({ where: { id: id } , relations : ["postcategory"]});
    if (_.isNaN(post) || _.isNil(post)) {
      throw new BadRequestException('게시물을 찾지 못하였습니다');
    }
    return await this.postRepository.findOne({
      where: { id, deletedAt: null },
      select: ['title', 'content', 'updatedAt'],
    });
  }

  async update(id: number,filename: string,file: Buffer,title: string,content: string, tags : string[] , userId: number,) {
    const ext = extname(filename);
    const baseName = basename(filename, ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`;

    const post = await this.postRepository.findOne({ where: { id: id } });

    if (_.isNil(post) || _.isNaN(post)) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    } 
    else if (post.userId === userId) {
      await this.s3Client.send(new PutObjectCommand({ Bucket: 'sunah', Key: filenames, Body: file }));
      await this.postRepository.update({ id },
        {
          thumbnail: "https://sunah.s3.ap-northeast-2.amazonaws.com/" + filenames,
          title: title,
          content: content,
        },
      );
      await this.PostcategoryRepository.delete({postId : id})
      tags.map(async(item) => (
        await this.PostcategoryRepository.save({postId : post.id , category : item})
      ))
      return { message: '게시물을 수정하였습니다' };
    }
    else if(post.userId !== userId){
      return {message : "수정 권한이 없습니다"}
    }
  }

  async remove(id: number, userId: number) {
    const postDelete = await this.postRepository.findOne({ where: { id: id }, relations: ['postcategory'] });

    if (_.isNaN(postDelete) || _.isNil(postDelete)) {
      throw new BadRequestException('게시물을 찾을 수 없습니다.');
    }
    if (postDelete.userId === userId) {
      await this.PostcategoryRepository.delete({postId : id})
      await this.postRepository.delete({ id });
      return { message: '게시물을  삭제하였습니다' };
    }
  }
}
