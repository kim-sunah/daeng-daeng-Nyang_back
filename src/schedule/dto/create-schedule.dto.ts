import { IsDate, IsString } from "class-validator";


export class CreateScheduleDto {

    @IsString()
    petId : string

    @IsString()
    title: string

    @IsString()
    content: string

    date : Date

    @IsString()
    category : string
}
