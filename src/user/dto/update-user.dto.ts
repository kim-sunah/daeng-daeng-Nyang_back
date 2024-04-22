import { IsString, IsEmail , IsMobilePhone , IsStrongPassword , IsNotEmpty, IsEnum, IsOptional } from "class-validator";
import { IsEqualTo } from "src/auth/decorators/match.decorator";

export enum  Gender {
    Male,
    Female
}
export class UpdateuserDto {

    @IsEmail({}, {message : "이메일 형식에 맞게 입력해주세요"})
    @IsNotEmpty({message : "이메일을 입력해주세요"})
    Email : string

    @IsString()
    @IsNotEmpty({message : "Please enter your password"})
    Password : string


    @IsString()
    @IsEqualTo("Password")
    ConfirmPassword : string


}