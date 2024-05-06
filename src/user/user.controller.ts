import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';

import { UserInfo } from 'src/auth/decorators/userinfo.decorator';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guards';

// @UseGuards(JwtAuthGuard)
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @UseGuards(JwtAuthGuard)
  @Get('/mypage')
  async getUserInfo(@UserInfo() userinfo: User) {
    console.log(userinfo);
    const user = await this.userService.getUserInfo(userinfo.id);
    return {
      statusCode: HttpStatus.OK,
      message: '회원 정보를 성공적으로 가져왔습니다.',
      user,
    };
  }

  //   @Get('/HostImg/:id')
  //   async getHostInfo(@Param() userinfo: any) {
  //     console.log(userinfo);
  //     const host = await this.userService.getUserInfo(userinfo.id);
  //     return {
  //       statusCode: HttpStatus.OK,
  //       message: '트레이너 정보를 성공적으로 가져왔습니다.',
  //       host,
  //     };
  //   }
  @UseGuards(JwtAuthGuard)
  @Get('/post')
  async getPost(@UserInfo() userinfo: User) {
    return await this.userService.getPost(+userinfo.id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('MypageUpdate')
  async updateUserinfo(
    @UserInfo() userinfo: User,
    @Body() updateUser: UpdateUserDto,
  ) {
    const updateuser = await this.userService.updateUserinfo(
      userinfo.id,
      updateUser,
    );

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
