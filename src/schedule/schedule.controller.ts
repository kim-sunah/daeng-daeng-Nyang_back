import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { CreateScheduleDto } from './dto/create-schedule.dto';
import { UpdateScheduleDto } from './dto/update-schedule.dto';
import { UserInfo } from 'src/auth/decorators/userinfo.decorator';
import { User } from 'src/user/entities/user.entity';
import { JwtAuthGuard } from 'src/auth/guard/jwt-auth.guards';

@Controller('schedule')

export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(@Body() createScheduleDto: CreateScheduleDto,@UserInfo() userinfo: User) {
    // console.log(createScheduleDto, userinfo);
    return this.scheduleService.create(createScheduleDto, +userinfo.id);
  }

  // 자신의 펫 모든 일정 정보 가져오기
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(@UserInfo() userinfo: User) {
    return this.scheduleService.findAll(+userinfo.id);
  }

  //자신의 펫 일정 정보 가져오기
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string,@UserInfo() userinfo: User) {
    return this.scheduleService.findOne(+id, +userinfo.id);
  }

  //자신의 펫 일정 업데이트
  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto,@UserInfo() userinfo: User) {
    return this.scheduleService.update(+id, updateScheduleDto, +userinfo.id);
  }

  //자신의 펫 일정 삭제
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserInfo() userinfo: User) {
    console.log(userinfo.id)
    return this.scheduleService.remove(+id, userinfo.id);
  }
}
