import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Pet } from './entities/pet.entity';
import { PetService } from './pet.service';
import { PetController } from './pet.controller';
import { User } from 'src/user/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Pet,User])],
  controllers: [PetController],
  providers: [PetService],
})

export class PetModule {}
