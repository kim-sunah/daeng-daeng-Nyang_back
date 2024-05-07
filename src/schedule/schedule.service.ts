import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Schedule, categorys } from './entities/schedule.entity';
import { Repository } from 'typeorm';

import { Pet } from 'src/pet/entities/pet.entity';

@Injectable()
export class ScheduleService {
  constructor(
    @InjectRepository(Schedule)
    private ScheduleRepository: Repository<Schedule>,
    @InjectRepository(Pet) private PetRepository: Repository<Pet>,
  ) {}

  async create(createScheduleDto: CreateScheduleDto, userId: number) {
    const schedule = await this.ScheduleRepository.find({
      where: { date: createScheduleDto.date },
    });
    if (schedule.length > 2) {
      throw new BadRequestException(
        '일정이 가득 찼습니다. 잠시 후 다시 시도하세요.',
      );
    }
    if (createScheduleDto.category === '병원') {
      return await this.ScheduleRepository.save({
        title: createScheduleDto.title,
        content: createScheduleDto.content,
        userId: userId,
        date: createScheduleDto.date,
        place: createScheduleDto.place,
        location: createScheduleDto.location,
        category: categorys.HOSPITAL,
        petId: +createScheduleDto.petId,
      });
    } else if (createScheduleDto.category === '산책') {
      return await this.ScheduleRepository.save({
        title: createScheduleDto.title,
        content: createScheduleDto.content,
        userId: userId,
        date: createScheduleDto.date,
        place: createScheduleDto.place,
        location: createScheduleDto.location,
        category: categorys.WALK,
        petId: +createScheduleDto.petId,
      });
    } else if (createScheduleDto.category === '예방접종') {
      return await this.ScheduleRepository.save({
        title: createScheduleDto.title,
        content: createScheduleDto.content,
        userId: userId,
        date: createScheduleDto.date,
        place: createScheduleDto.place,
        location: createScheduleDto.location,
        category: categorys.VACCINATION,
        petId: +createScheduleDto.petId,
      });
    }
  }

  async findAll(userId: number) {
    try {
      const MyPet = await this.PetRepository.find({
        where: { userId },
        relations: ['schedule'],
      });
      if (MyPet.length === 0) {
        return { message: '펫이 존재하지 않습니다.' };
      }
      return MyPet;
    } catch (err) {
      throw new Error(err);
    }
  }

  async findOne(id: number, userId: number) {
    try {
      const MyPet = await this.PetRepository.find({
        where: { userId, id },
        relations: ['schedule'],
      });
      console.log(MyPet[0]);
      if (MyPet.length === 0) {
        return { message: '펫이 존재하지 않습니다.' };
      }
      return MyPet[0];
    } catch (err) {
      throw new Error(err);
    }
  }

  async update(
    id: number,
    updateScheduleDto: UpdateScheduleDto,
    userId: number,
  ) {
    try {
      const schedule = await this.ScheduleRepository.findOne({
        where: { id, userId },
      });
      if (!schedule) {
        throw new NotFoundException('일정을 찾을수 없습니다');
      }

      if (updateScheduleDto.category === '병원') {
        await this.ScheduleRepository.update(id, {
          title: updateScheduleDto.title,
          content: updateScheduleDto.content,
          date: updateScheduleDto.date,
          place: updateScheduleDto.place,
          location: updateScheduleDto.location,
          category: categorys.HOSPITAL,
        });
      } else if (updateScheduleDto.category === '산책') {
        await this.ScheduleRepository.update(id, {
          title: updateScheduleDto.title,
          content: updateScheduleDto.content,
          date: updateScheduleDto.date,
          place: updateScheduleDto.place,
          location: updateScheduleDto.location,
          category: categorys.WALK,
        });
      } else if (updateScheduleDto.category === '예방접종') {
        await this.ScheduleRepository.update(id, {
          title: updateScheduleDto.title,
          content: updateScheduleDto.content,
          date: updateScheduleDto.date,
          place: updateScheduleDto.place,
          location: updateScheduleDto.location,
          category: categorys.VACCINATION,
        });
      }
      return { message: '일정을 변경하였습니다.' };
    } catch (err) {
      throw new Error(err);
    }
  }

  async remove(id: number, userId: number) {
    try {
      const schedule = await this.ScheduleRepository.findOne({
        where: { id, userId },
      });
      if (!schedule) {
        throw new NotFoundException('일정을 찾을수 없습니다');
      }
      await this.ScheduleRepository.delete({ id });
      return { message: '일정을 삭제하였습니다.' };
    } catch (err) {
      throw new Error(err);
    }
  }
}
