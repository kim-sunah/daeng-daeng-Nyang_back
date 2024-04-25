import { Module } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { ScheduleController } from './schedule.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { User } from '../user/entities/user.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports :[ TypeOrmModule.forFeature([Schedule, User]), AuthModule],
  controllers: [ScheduleController],
  providers: [ScheduleService],
})
export class ScheduleModule {}
