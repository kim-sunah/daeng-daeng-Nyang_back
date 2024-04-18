import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) {}

  //펫 리스트
  //펫 등록
  //펫 정보 수정
  //펫 삭제
  
}
