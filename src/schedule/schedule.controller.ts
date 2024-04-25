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

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.scheduleService.findOne(+id);
  // }

  @Patch(':id')
  @UseGuards(JwtAuthGuard)
  update(@Param('id') id: string, @Body() updateScheduleDto: UpdateScheduleDto,@UserInfo() userinfo: User) {
    return this.scheduleService.update(+id, updateScheduleDto, +userinfo.id);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  remove(@Param('id') id: string, @UserInfo() userinfo: User) {
    console.log(userinfo.id)
    return this.scheduleService.remove(+id, userinfo.id);
  }
}
