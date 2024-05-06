import {
  BadRequestException,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { Post } from '../post/entities/post.entity';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { basename, extname, relative } from 'path';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    @InjectRepository(Post) private readonly postRepository: Repository<Post>,
    private readonly configService: ConfigService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}
  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('S3_REGION'),
    credentials: {
      accessKeyId: process.env.AWS_S3_accessKeyId,
      secretAccessKey: process.env.AWS_S3_secretAccessKey,
    },
  });

  async getUserInfo(id: number) {
    const user = await this.userRepository.findOne({
      where: { id },
      relations: ['posts'],
    });
    if (!user) {
      throw new NotFoundException('사용자를 찾을 수 없습니다.');
    }

    return user;
  }

  async getHostInfo(id: number) {
    const host = await this.userRepository.findOneBy({ id });

    if (!host) {
      throw new NotFoundException('트레이너 정보를 찾을 수 없습니다.');
    }

    return host;
  }

  async getPost(id: number) {
    return await this.userRepository.find({});
  }

  async updateUserinfo(id: number, updateUser: UpdateUserDto) {
    const hashedPassword = await bcrypt.hashSync(updateUser.Password, 12);
    return await this.userRepository.update(id, {
      email: updateUser.Email,
      password: hashedPassword,
    });
  }

  async Allproduct(id: number) {
    const postList = await this.postRepository.find({ where: { userId: id } });
    return postList;
  }
}
