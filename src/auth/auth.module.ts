// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { MailerModule } from '@nestjs-modules/mailer';
import { HandlebarsAdapter } from '@nestjs-modules/mailer/dist/adapters/handlebars.adapter';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { JwtAuthGuard } from './guard/jwt-auth.guards';
import { MessageModule } from 'src/message/message.module';
import { MessageService } from 'src/message/message.service';
import { Message } from '../message/entities/message.entity';
import { EventsModule } from 'src/events/events.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User, Message]), // MessageRepository 추가
    PassportModule,
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        secret: config.get<string>('JWT_SECRET_KEY'),
      }),
    }),
    MailerModule.forRoot({
      transport: {
        host: 'smtp.naver.com',
        port: 465,
        auth: {
          user: 'chlxodud04@naver.com',
          pass: 'military22',
        },
      },
      defaults: {
        from: '"nest-modules" <chlxodud04@naver.com>',
      },
      template: {
        dir: __dirname + '/templates',
        adapter: new HandlebarsAdapter(),
        options: {
          strict: true,
        },
      },
    }),
    EventsModule, // 여기에 추가
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtAuthGuard, MessageService],
  exports: [AuthService],
})
export class AuthModule {}
