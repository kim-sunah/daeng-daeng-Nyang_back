import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageController } from './message.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { EventsGateway } from 'src/events/events.gateway';

@Module({
  imports: [
    TypeOrmModule.forFeature([Message, User]),
    AuthModule,
    JwtModule,
  ],
  controllers: [MessageController],
  providers: [MessageService, EventsGateway],
  exports: [MessageService],
})
export class MessageModule {}
