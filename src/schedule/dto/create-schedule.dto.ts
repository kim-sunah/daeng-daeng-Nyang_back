import { IsDate, IsString } from 'class-validator';

export class CreateScheduleDto {
  @IsString()
  petId: string;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  place: string;

  @IsString()
  location: string;

  @IsString()
  date: Date;

  @IsString()
  category: string;
}
