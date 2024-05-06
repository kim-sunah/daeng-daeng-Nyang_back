import { Controller, Get, Post, Body, Patch, Param, Delete, Put, UseGuards, UseInterceptors, UploadedFile, HttpException, HttpStatus } from '@nestjs/common';
import { PetService } from './pet.service';
import { CreatePetDto } from './dto/create-pet.dto';
import { UpdatePetDto } from './dto/update-pet.dto';
import { update } from 'lodash';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guards';
import { FileInterceptor } from '@nestjs/platform-express';
import { UserInfo } from 'src/auth/decorators/userinfo.decorator';
import { User } from 'src/user/entities/user.entity';
import path from 'path';

@Controller('pet')
export class PetController {
  constructor(private readonly petService: PetService) { }

  //펫 전체리스트
  @Get("AllpetList")
  PetList() {
    return this.petService.PetList();
  }


  //자신의 펫 리스트 
  @Get("/MyPetList")
  @UseGuards(JwtAuthGuard)
  MyPetList(@UserInfo() userinfo: User) {
    return this.petService.MyPetList(+userinfo.id);
  }

  //자신의 펫 상세정보
  @Get("/MyPetDetail/:id")
  @UseGuards(JwtAuthGuard)
  MyPetDetail(@Param("id") id : string, @UserInfo() userinfo: User) {
    return this.petService.MyPetDetail(+id, +userinfo.id);
  }

  //펫 등록
  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  PetRegistration(@UploadedFile() file: Express.Multer.File, @Body("rfidCd") rfidCd: string, @Body("dogNm") dogNm: string, @Body("sexNm") sexNm: string, @Body("neuterYn") neuterYn: boolean, @Body("kindNm") kindNm: string, @UserInfo() userinfo: User) {
    const supportedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!supportedExtensions.includes(fileExt)) {
      throw new HttpException(`지원하지 않는 파일 확장자입니다. (${supportedExtensions.join(', ')})`, HttpStatus.BAD_REQUEST);
    }
    return this.petService.create(file.originalname, file.buffer, rfidCd, dogNm, sexNm, neuterYn, kindNm, +userinfo.id);
  }
  //펫 정보 수정
  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('profileImage'))
  PetUpdate(@Param('id') id: string, @UserInfo() userinfo: User, @UploadedFile() file: Express.Multer.File, @Body("rfidCd") rfidCd: string, @Body("dogNm") dogNm: string, @Body("sexNm") sexNm: string, @Body("neuterYn") neuterYn: boolean, @Body("kindNm") kindNm: string) {
    const supportedExtensions = ['.jpg', '.jpeg', '.png'];
    const fileExt = path.extname(file.originalname).toLowerCase();
    if (!supportedExtensions.includes(fileExt)) {
      throw new HttpException(`지원하지 않는 파일 확장자입니다. (${supportedExtensions.join(', ')})`, HttpStatus.BAD_REQUEST)
    }
    return this.petService.PetUpdate(+id, userinfo.id, file.originalname, file.buffer, rfidCd, dogNm, sexNm, neuterYn, kindNm);
   

  }

  //펫 삭제
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  PetDelete(@Param('id') id: string,@UserInfo() userinfo: User ) {
    return this.petService.PetDelete(+id, +userinfo.id)

  }

}
