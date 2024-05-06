import {
  IsString,
  IsEmail,
  IsMobilePhone,
  IsStrongPassword,
  IsNotEmpty,
  IsEnum,
  IsOptional,
} from 'class-validator';
import { IsEqualTo } from '../decorators/match.decorator';

export class CreateuserDto {
  @IsEmail({})
  email: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter your password' })
  password: string;

  @IsString()
  @IsEqualTo('password')
  confirmPassword: string;

  @IsString()
  @IsNotEmpty({ message: 'Please enter a nickname' })
  name: string;

  // @IsString()
  // @IsNotEmpty({ message: 'Please enter the Authentication number' })
  // emailAuthentication: string;
}
