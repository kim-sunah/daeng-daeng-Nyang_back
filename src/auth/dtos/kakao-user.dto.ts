import { IsString } from "class-validator";

export class KakaoLoginDto {
    
    @IsString()
    email : string

    @IsString()
    name : string
}