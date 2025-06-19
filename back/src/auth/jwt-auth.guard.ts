import {
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  canActivate(context: ExecutionContext) {
    // AuthGuard('jwt')의 canActivate 메서드 호출
    return super.canActivate(context);
  }

  handleRequest(err, user, info) {
    if (err || !user) {
      if (err?.name === 'TokenExpiredError') {
        throw new UnauthorizedException(
          '토큰이 만료되었습니다. 다시 로그인해주세요.',
        );
      }

      if (err?.name === 'JsonWebTokenError') {
        throw new UnauthorizedException(
          '유효하지 않은 토큰입니다. 다시 로그인해주세요.',
        );
      }

      throw err || new UnauthorizedException('인증에 실패했습니다.');
    }

    return user;
  }
}
