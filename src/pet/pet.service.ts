import _ from 'lodash';
import { Repository } from 'typeorm';

import {
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


@Injectable()
export class PetService {
  constructor(@InjectRepository(Pet) private petRepository: Repository<Pet>,private readonly configService: ConfigService){}

  private readonly s3Client = new S3Client({
    region: this.configService.getOrThrow('AWS_REGION'),
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY,
        secretAccessKey: process.env.AWS_SECRET_KEY,
    },
});

  //자신의 펫 리스트
  async MyPetList(id : number){
    return await this.petRepository.find({where:{ userId : id}})
  }

  async PatList(){
    return await this.petRepository.find();
  }

  //펫 등록
  async create(filename : string, file :Buffer, rfidCd: string, dogNm : string , sexNm : string, neuterYn: boolean, kindNm:string, userId: number){
    const ext = extname(filename);
    const baseName = basename(filename,ext);
    const filenames = `images/${baseName}-${Date.now()}${ext}`
    console.log(filename)
    try{
   
      await this.s3Client.send(new PutObjectCommand({Bucket : "sunah" , Key : filenames, Body:file}))
      await this.petRepository.save({userId, profileImage:filenames, rfidCd, dogNm,sexNm,neuterYn : true,kindNm})
      console.log("upload image")
    }
    catch(err){
      console.log("Error")
    }
  }

  
  //펫 정보 수정


  //펫 삭제


}
