import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guards';
import { Request } from 'express';
import { UserInfo } from 'src/auth/decorators/userinfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { FileInterceptor } from '@nestjs/platform-express';
import path from 'path';
@Controller('post')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))create(@UploadedFile() file: Express.Multer.File,@Body('title') title: string, @Body('content') content: string, @Body('tags') tags: string[], @UserInfo() userinfo: User) {
    const supportedExtensions = ['.jpg', '.jpeg', '.png','webp','avif'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!supportedExtensions.includes(fileExt)) {
      throw new HttpException(
        `지원하지 않는 파일 확장자입니다. (${supportedExtensions.join(', ')})`,
        HttpStatus.BAD_REQUEST,
      );
    }
  
    return this.postService.create(file.originalname,file.buffer,title,content, tags , +userinfo.id);
  }
  //모든 게시물 조회
  @Get("All/:page")
  findAll(@Param('page') page: string) {
    return this.postService.findAll(+page);
  }


  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('thumbnail'))
  update(@UploadedFile() file: Express.Multer.File , @Param('id') id: string,@Body('title') title: string,@Body('content') content: string,@Body('tags') tags: string[],@UserInfo() userinfo: User,) {
   
    const supportedExtensions = ['.jpg', '.jpeg', '.png','webp','avif'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!supportedExtensions.includes(fileExt)) {
      throw new HttpException(
        `지원하지 않는 파일 확장자입니다. (${supportedExtensions.join(', ')})`,
        HttpStatus.BAD_REQUEST,
      );
    }
    return this.postService.update(
      +id,
      file.originalname,
      file.buffer,
      title,
      content,
      tags,
      userinfo.id,
     
    );
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserInfo() userinfo: User) {
    return this.postService.remove(+id, userinfo.id);
  }
}
