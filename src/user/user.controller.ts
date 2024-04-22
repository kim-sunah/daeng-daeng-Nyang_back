import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  Put,
  Request,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { UserService } from './user.service';

import { AuthGuard } from '@nestjs/passport';
import { UserInfo } from 'src/auth/decorators/userinfo.decorator';
import { User } from './entities/user.entity';
import { UpdateuserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/Mypage')
  async getUserInfo(@UserInfo() userinfo: User) {
      console.log(userinfo);
      const user = await this.userService.getUserInfo(userinfo.id);
      return {
          statusCode: HttpStatus.OK,
          message: '회원 정보를 성공적으로 가져왔습니다.',
          user,
      };
  }

  @Get('/HostImg/:id')
  async getHostInfo(@Param() userinfo: any) {
      console.log(userinfo);
      const host = await this.userService.getUserInfo(userinfo.id);
      return {
          statusCode: HttpStatus.OK,
          message: '트레이너 정보를 성공적으로 가져왔습니다.',
          host,
      };
  }

  @UseGuards(JwtAuthGuard)
  @Post('MypageUpdate')
  async updateUserinfo(@UserInfo() userinfo: User, @Body() updateUser: UpdateuserDto) {
      const updateuser = await this.userService.updateUserinfo(userinfo.id, updateUser);

      return {
          statusCode: HttpStatus.OK,
          updateuser,
      };
  }

  @UseGuards(JwtAuthGuard)
  @Get('Allproduct')
  async Allproduct(@UserInfo() userinfo: User) {
      const productlist = await this.userService.Allproduct(+userinfo.id);

      return {
          statusCode: HttpStatus.OK,
          productlist,
      };
  }
}
