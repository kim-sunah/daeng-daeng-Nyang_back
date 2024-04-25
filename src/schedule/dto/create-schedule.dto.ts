import { IsDate, IsString } from "class-validator";


export class CreateScheduleDto {

    @IsString()
    title: string

    @IsString()
    content: string

    
    date : Date

    @IsString()
    Category : string
}
