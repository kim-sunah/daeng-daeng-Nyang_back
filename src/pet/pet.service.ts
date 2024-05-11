import _ from 'lodash';
import { Repository } from 'typeorm';

import {
  HttpCode,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';

import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

import { Pet } from './entities/pet.entity';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { basename, extname } from 'path';
import { Schedule } from 'src/schedule/entities/schedule.entity';


@Injectable()
export class PetService {
  constructor(@InjectRepository(Pet) private petRepository: Repository<Pet>, private readonly configService: ConfigService, @InjectRepository(Schedule) private scheduleRepository: Repository<Schedule>) { }

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY,
      secretAccessKey: process.env.AWS_SECRET_KEY,
    },
  });

  //펫 전체 리스트
  async PetList() {
    return await this.petRepository.find();
  }

  //자신의 펫 리스트
  async MyPetList(userId: number) {
    try {
      const MyPet = await this.petRepository.find({ where: { userId } })
      if (MyPet.length === 0) {
        return { message: "펫이 존재하지않습니다." }
      }
      
      return MyPet;
    }
    catch (err) {
      throw new Error(err)
    }

  }

  //자신의 펫 상세정보
  async MyPetDetail(id: number, userId: number) {
   
      const MyPet = await this.petRepository.findOne({ where: { id } ,relations:["schedule"] })
      if (!MyPet) {
        return { message: "펫이 존재하지않습니다." }
      }
      if(MyPet.userId === userId){
        return MyPet;
      }
  }


  //펫 등록
  async create(filename: string, file: Buffer, name: string, age: string, breed: string, birth: Date, gender: string, userId: number) {
    const ext = extname(filename);
    const baseName = basename(filename, ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`

    try {
      await this.s3Client.send(new PutObjectCommand({ Bucket: "sunah", Key: filenames, Body: file }))
      await this.petRepository.save({ userId, profileImage: "https://sunah.s3.ap-northeast-2.amazonaws.com/" + filenames, name, age, breed, birth, gender })
      return { message: "등록에 성공하였습니다" }
    }
    catch (err) {
      throw new Error(err);
    }
  }

  async createNotImage(name: string, age: string, breed: string, birth: Date, gender: string, userId: number) {

    try {
      await this.petRepository.save({ userId, name, age, breed, birth, gender })
      return { message: "등록에 성공하였습니다" }
    }
    catch (err) {
      throw new Error(err);
    }

  }




  //펫 정보 수정
  async PetUpdate(id: number, userId: number, filename: string, file: Buffer, name: string, age: string, breed: string, birth: Date, gender: string,) {
    const ext = extname(filename);
    const baseName = basename(filename, ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`
    const pet = await this.petRepository.findOne({ where: { id } });
    if (pet.userId === userId) {
      await this.s3Client.send(new PutObjectCommand({ Bucket: "sunah", Key: filenames, Body: file }))
      await this.petRepository.update({ id, userId }, { userId, profileImage: "https://sunah.s3.ap-northeast-2.amazonaws.com/" + filenames, name, age, breed, birth, gender })
      return { message: "수정에 성공하였습니다" }

    }
    return { message: "수정 권한이 없습니다." }




  }

  async PetUpdateNotimage(id: number, userId: number, name: string, age: string, breed: string, birth: Date, gender: string) {

    const pet = await this.petRepository.findOne({ where: { id } });
    if (pet.userId === userId) {
      await this.petRepository.update({ id, userId }, { userId, name, age, breed, birth, gender })
      return { message: "수정에 성공하였습니다" }
    }
    return { message: "수정 권한이 없습니다." }

  }

  //펫 삭제
  async PetDelete(id: number, userId: number) {
    const Pet = await this.petRepository.findOne({ where: { id } });
    if (!Pet) {
      throw new HttpException('펫을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    if (Pet.id === userId) {
      await this.scheduleRepository.delete({ petId: id, userId })
      await this.petRepository.delete({ id, userId });
      return { message: "삭제에 성공했습니다" }
    }
    return { message: "삭제 권한이 없습니다" }

  }
}
