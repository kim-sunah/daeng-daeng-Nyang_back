import {
  ExecutionContext,
  Injectable,
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
    try {
      
      const req = context.switchToHttp().getRequest();
      const accessToken = req.headers.authorization.split(' ')[1];
      const refreshToken = req.headers.refreshtoken;

      if (!accessToken || !refreshToken) {
        console.log(accessToken, "-" ,refreshToken)
        throw new UnauthorizedException('접근할 수 없습니다.');
      }
 
      // access token 검증
      const isVerifiedAccessToken =
        await this.authService.verifyAccessToken(accessToken);
      const id = isVerifiedAccessToken.id;
      console.log(accessToken, refreshToken);

      if (isVerifiedAccessToken.message === 'jwt expired') {
        // refresh token 검증

        const isVerifiedRefreshToken =
          await this.authService.verifyRefreshToken(refreshToken);

        // refresh token 만료
        if (isVerifiedRefreshToken.message === 'jwt expired') {
          throw new UnauthorizedException(
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
    } catch (err) {
      throw new UnauthorizedException('로그인이 필요한 서비스입니다');
    }
  }
}
