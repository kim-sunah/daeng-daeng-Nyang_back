import { IsEmail, IsNotEmpty, IsString } from 'class-validator';
export class SignInDto {
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter your password' })
  password: string;
}
