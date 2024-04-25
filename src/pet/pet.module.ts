import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pet } from './entities/pet.entity';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { User } from '../user/entities/user.entity';
import { Schedule } from '../schedule/entities/schedule.entity';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([Pet,User,Schedule]), AuthModule],
  controllers: [PetController],
  providers: [PetService],
})

export class PetModule {}
