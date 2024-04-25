import { Injectable } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(@InjectRepository(Schedule) private ScheduleRepository : Repository<Schedule>){}
  async create(createScheduleDto: CreateScheduleDto, userId : number) {
    return await this.ScheduleRepository.save({title : createScheduleDto.title, content : createScheduleDto.content, userId : userId , date: createScheduleDto.date, Category: createScheduleDto.Category})
    
  }

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  update(id: number, updateScheduleDto: UpdateScheduleDto, userId : number) {
      console.log(updateScheduleDto)
    return `This action updates a #${id} schedule`;
  }

  remove(id: number) {
    return `This action removes a #${id} schedule`;
  }
}
