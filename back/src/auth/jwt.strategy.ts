import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private usersService: UsersService,
    private configService: ConfigService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET_KEY'),
    });
  }

  async validate(payload: any) {
    console.log('JWT Strategy - 토큰 페이로드:', payload);

    if (!payload.userId) {
      throw new UnauthorizedException('유효하지 않은 토큰입니다.');
    }

    const user = await this.usersService.findOne(payload.userId);
    if (!user) {
      throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
    }

    return {
      ...user,
      sub: user.id,
      id: user.id,
    };
  }
}
