import { IsString} from "class-validator";
export class googleLoginDto {
    
    @IsString()
    email : string

    @IsString()
    name : string
    
}