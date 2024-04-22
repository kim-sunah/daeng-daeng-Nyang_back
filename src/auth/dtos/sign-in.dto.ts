import { IsEmail, IsNotEmpty, IsString } from "class-validator"
export class SignInDto {
    @IsEmail()
    Email : string 

    @IsString()
    @IsNotEmpty({message : "Please enter your password"})
    Password : string
}