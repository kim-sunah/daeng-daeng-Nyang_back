import {
  ConflictException,
  ExecutionContext,
  Injectable,
  NotAcceptableException,
  RequestTimeoutException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from '../auth.service';
import { access } from 'fs';
import { ref } from 'joi';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private authService: AuthService) {
    super('jwt');
  }
  async canActivate(context: ExecutionContext) {
    const req = context.switchToHttp().getRequest();
    const accessToken = req.headers.authorization.split(' ')[1];
    const refreshToken = req.headers.refreshtoken;

    if (!accessToken || !refreshToken) {
      console.log(accessToken, '-', refreshToken);
      throw new RequestTimeoutException('접근할 수 없습니다.');
    }

    // access token 검증
    const isVerifiedAccessToken =
      await this.authService.verifyAccessToken(accessToken);
    if (isVerifiedAccessToken.id) {
      const id = isVerifiedAccessToken.id;
      if (isVerifiedAccessToken.message === 'jwt expired') {
        // refresh token 검증
        const isVerifiedRefreshToken =
          await this.authService.verifyRefreshToken(refreshToken);
        // refresh token 만료
        if (isVerifiedRefreshToken.message === 'jwt expired') {
          throw new NotAcceptableException(
            '토큰이 만료되었습니다. 다시 로그인해주세요.',
          );
        }

        // access token 재발급
        const newAccessToken = await this.authService.createAccessToken(id);
        req.user = { id, accessToken: newAccessToken, refreshToken };
        return true;
      }
      req.user = { id, accessToken, refreshToken };
      return true;
    }
    throw new ConflictException('accessToken Error');
  }
}
