import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
} from '@nestjs/websockets';

import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Server } from 'socket.io';
var amqp = require('amqplib/callback_api');
const url =
  'amqps://chatPT:chatPT123456@b-e4d218f5-5560-4786-b2bc-f3185dca9ce3.mq.ap-northeast-2.amazonaws.com:5671';

@WebSocketGateway({ cors: { origin: '*' } })
export class EventsGateway {
  @WebSocketServer()
  server: Server;

  @SubscribeMessage('findAlluser')
  finduserAll(@MessageBody() message: string): void {
    this.server.emit('events', message);
  }

  @SubscribeMessage('findAllproduct')
  findproductAll(@MessageBody() message: string): void {
    this.server.emit('events', message);
  }

  @SubscribeMessage('Deleteproduct')
  Deleteproduct(@MessageBody() message: string): void {
    this.server.emit('events', message);
  }

  @SubscribeMessage('GetwishList')
  GetwishList(@MessageBody() message: string): void {
    this.server.emit('events', message);
  }
  @SubscribeMessage('UnwishList')
  UnwishList(@MessageBody() message: string): void {
    this.server.emit('events', message);
  }

  @SubscribeMessage('createcomment')
  createcomment(@MessageBody() message: string): void {
    this.server.emit('events', message);
  }
  @SubscribeMessage('updatgecomment')
  updatgecomment(@MessageBody() message: string): void {
    this.server.emit('events', message);
  }

  @SubscribeMessage('deletecomment')
  deletecomment(@MessageBody() message: string): void {
    this.server.emit('events', message);
  }

  @SubscribeMessage('createMessage')
  createMessage(@MessageBody() message: string): void {
    const msg = JSON.parse(message);
    amqp.connect(url, function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }

        const queue = msg.queue;

        channel.assertQueue(queue, {
          durable: false,
        });

        channel.consume(
          queue,
          function (msg) {
            console.log(' [x] Received %s', msg.content.toString());
          },
          {
            noAck: true,
          }
        );
      });
    });
    this.server.emit(msg.queue, message);
  }
}
