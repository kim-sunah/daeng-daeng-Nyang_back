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

@Injectable()
export class PetService {
  constructor(
    @InjectRepository(Pet) private petRepository: Repository<Pet>,
  ){}

  //펫 리스트
  async MyPetList(id : number){
    return await this.petRepository.find({
      where:{ userId : id},
    })
  }

  //펫 등록

  
  //펫 정보 수정


  //펫 삭제


}
