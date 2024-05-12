import { Cache } from 'cache-manager';
import _ from 'lodash';
import { Repository } from 'typeorm';

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
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
    @InjectRepository(Postcategory)
    private PostcategoryRepository: Repository<Postcategory>,
  ) {}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  async create(
    files: Array<Express.Multer.File>,
    title: string,
    content: string,
    tags: string[],
    userId: number,
  ) {
    let isFirstFileProcessed = false;
    let isSecondFileProcessed = false;
    for (const file of files) {
      const ext = extname(file.originalname);
      const baseName = basename(file.originalname, ext);
      const filenames = `images/${baseName}-${Date.now()}${ext}`;
      const postsave = this.postRepository.create({
        userId,
        thumbnail: 'https://sunah.s3.ap-northeast-2.amazonaws.com/' + filenames,
        title,
        content,
      });
      if (!isFirstFileProcessed) {
        await this.postRepository.save(postsave);
        if (postsave) {
          tags.map(
            async (item) =>
              await this.PostcategoryRepository.save({
                postId: postsave.id,
                category: item,
              }),
          );
        }
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: 'sunah',
            Key: filenames,
            Body: file.buffer,
          }),
        );
        isFirstFileProcessed = true;
      } else if (!isSecondFileProcessed) {
        const findpost = await this.postRepository.findOne({
          where: { userId, title, content, createdAt: postsave.createdAt },
        });
        await this.UploadRepository.save({
          postId: findpost.id,
          image: 'https://sunah.s3.ap-northeast-2.amazonaws.com/' + filenames,
        });
        await this.s3Client.send(
          new PutObjectCommand({
            Bucket: 'sunah',
            Key: filenames,
            Body: file.buffer,
          }),
        );
      }
      return {
        postsave: postsave,
        message: '게시물 작성 성공',
        STATUS_CODES: 200,
      };
    }
    return { message: '게시물 등록에 실패하였습니다.', STATUS_CODES: 402 };
  }

  async findAll(page: number) {
    try {
      const articles = await this.postRepository.find({
        where: { deletedAt: null },
        skip: (page - 1) * 16,
        take: 16,
        relations: ['postcategory', 'images'],
      });
      const cachedArticles = await this.cacheManager.get('articles');
      if (cachedArticles === articles) {
        return cachedArticles;
      }
      await this.cacheManager.set('articles', articles);
      return articles;
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_GATEWAY,
          error: '예상치 못한 에러가 발생했습니다.',
        },
        HttpStatus.BAD_GATEWAY,
        {
          cause: error,
        },
      );
    }
  }

  async findOne(id: number) {
    const post = await this.postRepository.findOne({
      where: { id: id },
      relations: ['postcategory', 'images'],
    });
    if (_.isNaN(post) || _.isNil(post)) {
      throw new BadRequestException('게시물을 찾지 못하였습니다');
    }
    return post;
  }

  async update(
    id: number,
    files: Array<Express.Multer.File>,
    title: string,
    content: string,
    tags: string[],
    userId: number,
  ) {
    let isFirstFileProcessed = false;
    let isSecondFileProcessed = false;
    const post = await this.postRepository.findOne({ where: { id: id } });
    if (post.userId === userId) {
      for (const file of files) {
        const ext = extname(file.originalname);
        const baseName = basename(file.originalname, ext);
        const filenames = `images/${baseName}-${Date.now()}${ext}`;

        if (_.isNil(post) || _.isNaN(post)) {
          throw new NotFoundException('게시물을 찾을 수 없습니다.');
        }
        const postsave = await this.postRepository.findOne({ where: { id } });
        if (!isFirstFileProcessed) {
          await this.postRepository.update(id, {
            userId,
            thumbnail:
              'https://sunah.s3.ap-northeast-2.amazonaws.com/' + filenames,
            title,
            content,
          });

          await this.PostcategoryRepository.delete({ postId: id });
          await this.UploadRepository.delete({ postId: id });
          if (postsave) {
            tags.map(
              async (item) =>
                await this.PostcategoryRepository.save({
                  postId: postsave.id,
                  category: item,
                }),
            );
          }
          isFirstFileProcessed = true;
        } else if (!isSecondFileProcessed) {
          await this.UploadRepository.save({
            postId: id,
            image: 'https://sunah.s3.ap-northeast-2.amazonaws.com/' + filenames,
          });
          await this.s3Client.send(
            new PutObjectCommand({
              Bucket: 'sunah',
              Key: filenames,
              Body: file.buffer,
            }),
          );
          // 두 번째 파일에 대한 처리를 여기에 추가
        }
        return {
          post: postsave,
          message: '게시물을 수정하였습니다',
          STATUS_CODES: 200,
        };
      }
      throw new UnauthorizedException('게시물 수정에 실패하였습니다.');
    } else if (post.userId !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }
  }

  async remove(id: number, userId: number) {
    const postDelete = await this.postRepository.findOne({
      where: { id: id },
      relations: ['postcategory', 'images'],
    });
    if (postDelete.userId === userId) {
      if (_.isNaN(postDelete) || _.isNil(postDelete)) {
        throw new BadRequestException('게시물을 찾을 수 없습니다.');
      }

      await this.PostcategoryRepository.delete({ postId: id });
      await this.UploadRepository.delete({ postId: id });
      await this.postRepository.delete({ id });
      return { message: '게시물을  삭제하였습니다' };
    } else if (postDelete.userId !== userId) {
      throw new UnauthorizedException('삭제 권한이 없습니다.');
    }
  }
}
