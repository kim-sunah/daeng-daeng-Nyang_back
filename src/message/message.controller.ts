import {
  Controller,
  Get,
  Post,
  Param,
  Request,
  UseGuards,
  Put,
  Body,
} from '@nestjs/common';
import { MessageService } from './message.service';
import { UserInfo } from '../auth/decorators/userinfo.decorator';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guards';
import { SendMessageDto } from './dto/send-message.dto';
import { User } from 'src/user/entities/user.entity';

var amqp = require('amqplib/callback_api');
const url =
  'amqps://chatPT:chatPT123456@b-e4d218f5-5560-4786-b2bc-f3185dca9ce3.mq.ap-northeast-2.amazonaws.com:5671';

@UseGuards(JwtAuthGuard)
@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  //message queue 생성하기
  @Get('new/:sendId')
  async createMessage(@UserInfo() userInfo: User, @Param() sendId: number) {
    return this.messageService.createMessage(userInfo.id, sendId);
  }

  //메세지 보내기
  @Post(':queue')
  async sendMessage(
    @Param('queue') queue: string,
    @UserInfo() userInfo: User,
    @Body() dto: SendMessageDto
  ) {
    console.log(queue);
    console.log(userInfo);
    console.log(dto);
    return this.messageService.sendMessage(queue, userInfo.id, dto);
  }

  //메세지 목록 가져오기
  @Get()
  async messageList(@UserInfo() userInfo: User) {
    return this.messageService.messageList(userInfo.id);
  }

  @Get(':queue')
  async receiveMessage(
    @Param('queue') queue: string,
    @UserInfo() userInfo: User
  ) {
    return await this.messageService.receiveMessage(queue, userInfo.id);
  }

  @Get('/receive/:queue')
  async newReceiveMessage(
    @Param('queue') queue: string,
    @UserInfo() userInfo: User
  ) {
    const message = await this.messageService.receiveNewMessage(queue);
    console.log('컨ㅌ롤러 리텅 : ', message);
    return { message: message, userId: userInfo.id };
  }
}
