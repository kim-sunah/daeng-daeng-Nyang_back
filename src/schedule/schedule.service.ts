import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule } from './entities/schedule.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ScheduleService {
  constructor(@InjectRepository(Schedule) private ScheduleRepository : Repository<Schedule>){}
  async create(createScheduleDto: CreateScheduleDto, userId : number) {
    return await this.ScheduleRepository.save({title : createScheduleDto.title, content : createScheduleDto.content, userId : userId , date: createScheduleDto.date, Category: createScheduleDto.Category, petId : createScheduleDto.petId})
    
  }

  findAll() {
    return `This action returns all schedule`;
  }

  findOne(id: number) {
    return `This action returns a #${id} schedule`;
  }

  async update(id: number, updateScheduleDto: UpdateScheduleDto, userId : number) {
    const schedule = await this.ScheduleRepository.findOne({where : {id}})
    if(!schedule){
      throw new NotFoundException("일정을 찾을수 없습니다")
    }

    await this.ScheduleRepository.update( id , {
      title: updateScheduleDto.title,
      content: updateScheduleDto.content,
      date: updateScheduleDto.title, // 이 부분이 title로 되어있어 수정이 필요합니다.
      Category: updateScheduleDto.Category
  }); 
    return {message : "일정을 변경하였습니다."}
  }

  async remove(id: number, userId : number) {
   const schedule = await this.ScheduleRepository.findOne({where :{id}})
   if(!schedule){
    throw new NotFoundException("일정을 찾을수 없습니다")
  }
   await this.ScheduleRepository.delete({id});
  return {message : "일정을 삭제하였습니다."}
  }
}
