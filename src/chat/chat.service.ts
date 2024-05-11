import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ChatService {
  constructor(
    @InjectRepository(Chat)
    private ChatRepository: Repository<Chat>,
    @InjectRepository(User)
    private UserRepository: Repository<User>,
  ) {}

  async myChatList(userId: number) {
    const chat = await this.ChatRepository.createQueryBuilder('chat')
      .where('chat.fromId = :userId OR chat.toId = :userId', { userId })
      .groupBy('chat.roomId')
      .getMany();

    if (chat.length == 0) {
      throw new BadRequestException('채팅 내역이 없습니다.');
    }

    return chat;
  }

  async create(createChatDto: CreateChatDto, userId: number) {
    const isChat = await this.ChatRepository.find({
      where: [
        { fromId: userId, toId: createChatDto.toId },
        { fromId: createChatDto.toId, toId: userId },
      ],
    });

    if (isChat) {
      //채팅 내역이 있을때
      return;
    } else {
      //채팅 내역이 없을때
    }
    return 'This action adds a new chat';
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }
}
