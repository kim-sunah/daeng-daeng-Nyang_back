import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateuserDto } from './dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../user/entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignInDto } from './dtos/sign-in.dto';
import { JwtService } from '@nestjs/jwt';
import { MailerService } from '@nestjs-modules/mailer';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

import { KakaoLoginDto } from './dtos/kakao-user.dto';
import { MessageService } from '../message/message.service';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
    private readonly mailerService: MailerService,
    private readonly messageService: MessageService,
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,
  ) {}

  async signUp({ email, password, name }: CreateuserDto) {
   
    try {
      const existedUser = await this.userRepository.findOne({
        where: { email: email },
      });

      if (existedUser) {
        throw new BadRequestException([
          `This Email is already in ${existedUser.registration_information} use`,
        ]);
      }
      
      const hashedPassword = await bcrypt.hashSync(password, 12);
      const user = this.userRepository.create({email: email,password: hashedPassword,registration_information: 'SITE',name});

      return this.createUser(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '회원 가입 중 오류가 발생했습니다.',
      );
    }
  }

  async signIn({ email, password }: SignInDto) {
    const user = await this.userRepository.findOne({ where: { email: email } });

    if (!user) {
      throw new BadRequestException(['This Email does not exist.']);
    }
    console.log(user);
    if (!(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException('Invalid password.');
    }

    const accessToken = await this.createAccessToken(+user.id);
    const refreshToken = await this.createRefreshToken();
    return { accessToken, refreshToken };
  }

  async kakosignUp({ email, name }: KakaoLoginDto) {
    try {
      const KAKAO_USER = await this.userRepository.findOne({
        where: { email: name, registration_information: 'KAKAO' },
      });
      if (KAKAO_USER) {
        return;
      }
      const existedUser = await this.userRepository.findOne({
        where: { email: email },
      });
      if (existedUser) {
        throw new BadRequestException(
          `This Email is already in ${existedUser.registration_information} use`,
        );
      }
      const user = this.userRepository.create({
        email: email,
        name: name,
        registration_information: 'KAKAO',
      });
      return this.createUser(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '회원 가입 중 오류가 발생했습니다.',
      );
    }
  }

  async createUser(user: User) {
    const userInfo = await this.userRepository.save(user);
    return userInfo;
  }

  async kakaosignIn(Email: string) {
    const user = await this.userRepository.findOne({ where: { email: Email } });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }
    const accessToken = await this.createAccessToken(+user.id);
    const refreshToken = await this.createRefreshToken();

    return { accessToken, refreshToken };
  }

  async naversignup(
    email: string,
    gender: string,
    phone: string,
    name: string,
  ) {
    var USER_GENDER;
    const NAVER_USER = await this.userRepository.findOne({
      where: { email: email, registration_information: 'NAVER' },
    });
    if (NAVER_USER) {
      return;
    }
    const user = await this.userRepository.findOne({ where: { email: email } });
    if (user) {
      throw new BadRequestException(
        `This Email is already in ${user.registration_information} use`,
      );
    }

    if (gender === 'M') {
      USER_GENDER = 'Male';
    } else if (gender === 'F') {
      USER_GENDER = 'Female';
    } else if (gender === 'U') {
      USER_GENDER = 'UNKNOW';
    }
    const naveruser = this.userRepository.create({
      registration_information: 'NAVER',
      email,
      name: name,
    });
    const userInfo = await this.userRepository.save(naveruser);
    return this.createUser(user);
    return userInfo;
  }

  async naversignin(email: string) {
    const user = await this.userRepository.findOne({
      where: { email: email, registration_information: 'naver' },
    });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }
    const accessToken = await this.createAccessToken(+user.id);
    const refreshToken = await this.createRefreshToken();
    return { accessToken, refreshToken };
  }

  async googlesignup({ email, name }: KakaoLoginDto) {
    try {
      const GOOGLE_USER = await this.userRepository.findOne({
        where: { email: email, registration_information: 'GOOGLE' },
      });
      if (GOOGLE_USER) {
        return;
      }
      const existedUser = await this.userRepository.findOne({
        where: { email: email },
      });
      if (existedUser) {
        throw new BadRequestException(
          `This Email is already in ${existedUser.registration_information} use`,
        );
      }
      const user = this.userRepository.create({
        email: email,
        name: name,
        registration_information: 'GOOGLE',
      });
      return this.createUser(user);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        '회원 가입 중 오류가 발생했습니다.',
      );
    }
  }

  async googlesignin(Email: string) {
    const user = await this.userRepository.findOne({ where: { email: Email } });
    if (!user) {
      throw new UnauthorizedException('존재하지 않는 이메일입니다.');
    }
    const accessToken = await this.createAccessToken(+user.id);
    const refreshToken = await this.createRefreshToken();

    return { accessToken, refreshToken };
  }
  async createAccessToken(id: number) {
    const payload = { id: id };
    return await this.jwtService.signAsync(payload, { expiresIn: '5m' });
  }

  // refresh token 만료기간 2주
  async createRefreshToken() {
    return await this.jwtService.signAsync({}, { expiresIn: '7d' });
  }

  async verifyAccessToken(access_token: string) {
    try {
      const payload = await this.jwtService.verify(access_token);

      return { success: true, id: payload.id };
    } catch (error) {
      const payload = await this.jwtService.verify(access_token, {
        ignoreExpiration: true,
      });

      return { success: false, message: error.message, id: payload.id };
    }
  }
  async verifyRefreshToken(refreshToken: string) {
    try {
      const payload = await this.jwtService.verify(refreshToken);

      return { success: true };
    } catch (error) {
      return { success: false, message: error.message };
    }
  }

  async emailCheck(email: string, sixDigitNumber: string) {
    this.mailerService
      .sendMail({
        to: email,
        from: '1004_sunah@naver.com',
        subject: '이메일 인증번호',
        html: `<b>${sixDigitNumber}</b>`,
      })
      .then((result) => {})
      .catch((error) => {
        new ConflictException(error);
      });
    console.log(sixDigitNumber);

    await this.cacheManager.set(email, sixDigitNumber, 60000);
    return { sucess: '이메일 인증' };
  }
}
