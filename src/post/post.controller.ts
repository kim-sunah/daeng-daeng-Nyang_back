import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';

import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { PostService } from './post.service';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guards';
import { Request } from 'express';
import { UserInfo } from 'src/auth/decorators/userinfo.decorator';
import { User } from 'src/user/entities/user.entity';
@Controller('post')

export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createPostDto: CreatePostDto, @UserInfo() userinfo: User) {
    return this.postService.create(createPostDto,userinfo.id);
  }

  @Get()
  findAll() {
    return this.postService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.postService.findOne(+id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto, @UserInfo() userinfo: User) {
    return this.postService.update(+id, updatePostDto,userinfo.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserInfo() userinfo: User) {
    return this.postService.remove(+id, userinfo.id);
   
  }
}