
import { IsDate, IsString } from 'class-validator';
import { CreateScheduleDto } from './create-schedule.dto';

export class UpdateScheduleDto {

    @IsString()
    title: string

    @IsString()
    content: string

   
    date : Date

    @IsString()
    category : string

}
