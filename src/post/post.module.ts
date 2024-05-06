import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Post } from './entities/post.entity';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from '../auth/guard/jwt-auth.guards';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AuthModule } from 'src/auth/auth.module';
import { Schedule } from 'src/schedule/entities/schedule.entity';
import { Upload } from 'src/uploads/entities/upload.entity';

@Module({

  imports: [TypeOrmModule.forFeature([Post,User, Schedule, Upload]) , AuthModule],
  controllers: [PostController],
  providers: [PostService],
})
export class PostModule {}