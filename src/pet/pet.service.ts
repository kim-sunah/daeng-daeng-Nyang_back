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
    try{
      const MyPet = await this.petRepository.find({ where: { userId } })
      if (MyPet.length === 0) {
        return { message: "펫이 존재하지않습니다." }
      }
      return MyPet;
    }
    catch(err){
      throw new Error(err)
    }

  }

  //자신의 펫 상세정보
  async MyPetDetail(id : number , userId : number){
    try{
      const MyPet = await this.petRepository.findOne({ where: { userId , id } })
      if (!MyPet) {
        return { message: "펫이 존재하지않습니다." }
      }
      return MyPet;
    }
    catch(err){
      throw new Error(err)
    }


  }


  //펫 등록
  async create(filename: string, file: Buffer, rfidCd: string, dogNm: string, sexNm: string, neuterYn: boolean, kindNm: string, userId: number) {
    const ext = extname(filename);
    const baseName = basename(filename, ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`

    try {
      await this.s3Client.send(new PutObjectCommand({ Bucket: "sunah", Key: filenames, Body: file }))
      await this.petRepository.save({ userId, profileImage: filenames, rfidCd, dogNm, sexNm, neuterYn: neuterYn, kindNm })
      return {message : "등록에 성공하였습니다"}
    }
    catch (err) {
      throw new Error(err);
    }
  }


  //펫 정보 수정
  async PetUpdate(id : number, userId : number, filename: string, file: Buffer, rfidCd: string, dogNm: string, sexNm: string, neuterYn: boolean, kindNm: string){
    const ext = extname(filename);
    const baseName = basename(filename, ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`
    try {
      await this.s3Client.send(new PutObjectCommand({ Bucket: "sunah", Key: filenames, Body: file }))
      await this.petRepository.update({id, userId},{ userId, profileImage: filenames, rfidCd, dogNm, sexNm, neuterYn: neuterYn, kindNm })
      return {message : "수정에 성공하였습니다"}
    }
    catch (err) {
      throw new Error(err);
    }


  }

  //펫 삭제
  async PetDelete(id : number , userId : number){
    const Pet = await this.petRepository.findOne({where : {id , userId}});
    if(!Pet){
      throw new HttpException('펫을 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
    }
    await this.scheduleRepository.delete({petId : id, userId})
    await this.petRepository.delete({id , userId});
    return {message : "삭제에 성공했습니다"}
  }
}
