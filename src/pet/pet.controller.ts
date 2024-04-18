import { Controller, Get, Post, Body, Patch, Param, Delete, Put } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { update } from 'lodash';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  //펫 전체리스트
  @Get()
  PetList(){

  }

  //펫 등록
  @Post()
  PetRegistration(CreatePetDto : CreatePetDto){

  }
  //펫 정보 수정
  @Put(':id')
  PetUpdate(@Param('id') id: string){

  }

  //펫 삭제
  @Delete(':id')
  PetDelete(@Param('id') id: string){

  }
  
}
