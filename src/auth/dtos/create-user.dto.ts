import { IsString, IsEmail , IsMobilePhone , IsStrongPassword , IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { IsEqualTo } from "../decorators/match.decorator";

export class CreateuserDto {


    @IsEmail({})
    Email : string

    @IsString()
    @IsNotEmpty({message : "Please enter your password"})
    Password : string

    @IsString()
    @IsEqualTo("Password")
    ConfirmPassword : string

    @IsString()
    @IsNotEmpty({message : "Please enter a nickname"})
    name : string

    @IsString()
    @IsNotEmpty({message : "Please enter the Authentication number"})
    Emailauthentication : string

}