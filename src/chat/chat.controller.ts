import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { ChatService } from './chat.service';
import { CreateChatDto } from './dto/create-chat.dto';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guards';
import { UserInfo } from 'src/auth/decorators/userinfo.decorator';
import { User } from 'src/user/entities/user.entity';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  myChatList(@UserInfo() userInfo: User) {
    return this.chatService.myChatList(+userInfo.id);
  }

  @Post()
  create(@Body() createChatDto: CreateChatDto, @UserInfo() userInfo: User) {
    return this.chatService.create(createChatDto, +userInfo.id);
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.chatService.findOne(+id);
  }
}
