import { Cache } from 'cache-manager';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException, Inject, Injectable, NotFoundException, UnauthorizedException
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { Post } from './entities/post.entity';
import { basename, extname } from 'path';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class PostService {
  constructor(@InjectRepository(Post) private postRepository: Repository<Post>,@Inject(CACHE_MANAGER) private cacheManager: Cache, private readonly configService: ConfigService) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

  async create(filename : string, file :Buffer, title: string, content : string , userId : number) {
    const ext = extname(filename);
    const baseName = basename(filename,ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`
    console.log(filename)
    try{
   
      await this.s3Client.send(new PutObjectCommand({Bucket : "sunah" , Key : filenames, Body:file}))
      await this.postRepository.save({userId:userId, thumbnail:filenames, title:title, content: content})
      console.log("upload image")
    }
    catch(err){
      console.log("Error")
    }
    
  }

  async findAll() {
    const cachedArticles = await this.cacheManager.get('articles');
    if (!_.isNil(cachedArticles)) {
      return cachedArticles;
    }
    const articles = await this.postRepository.find({
      where: { deletedAt: null },
      select: ['id', 'title', 'updatedAt'],
    });
    await this.cacheManager.set('articles', articles);
    return articles;
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({where : {id : id}});
    if (_.isNaN(post) || _.isNil(post)) {
      throw new BadRequestException('게시물을 찾지 못하였습니다');
    }
    return await this.postRepository.findOne({
      where: { id, deletedAt: null },
      select: ['title', 'content', 'updatedAt'],
    });
  }

  async update(id: number, updatePostDto: UpdatePostDto, userId : number) {
    const post = await this.postRepository.findOne({where : {id : id}});
    const { content , title, thumbnail} = updatePostDto;
    if (_.isNil(post) || _.isNaN(post)) {
      throw new NotFoundException('게시물을 찾을 수 없습니다.');
    }
    else if(post.userId === userId){
      await this.postRepository.update({ id }, { content, title, thumbnail });
      return {message : "게시물을 수정하였습니다"}
    }
  }

  async remove(id: number,  userId : number) {
    const postDelete = await this.postRepository.findOne({where : {id : id}});
  
    if (_.isNaN(postDelete) || _.isNil(postDelete)) {
      throw new BadRequestException('게시물을 찾을 수 없습니다.');
    }
    if(postDelete.userId === userId){
      await this.postRepository.softDelete({ id });
      return {message : "게시물을  삭제하였습니다"}
    }
  }
}