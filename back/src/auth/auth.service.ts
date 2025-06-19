import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(userId: string, password: string): Promise<any> {
    try {
      console.log(`사용자 검증 시도: ${userId}`);
      const user = await this.usersService.findOne(userId);

      if (!user) {
        console.log(`사용자 검증 실패: 사용자 없음 - ${userId}`);
        throw new UnauthorizedException('사용자를 찾을 수 없습니다.');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        console.log(`사용자 검증 실패: 비밀번호 불일치 - ${userId}`);
        throw new UnauthorizedException('비밀번호가 일치하지 않습니다.');
      }

      console.log(`사용자 검증 성공: ${userId}`);
      const { password: _, ...result } = user;
      return result;
    } catch (error) {
      console.error(`사용자 검증 오류: ${error.message}`);
      throw new UnauthorizedException(error.message);
    }
  }

  async login(user: any) {
    const payload = {
      sub: user.id,
      userId: user.userId,
      name: user.name,
      email: user.email,
    };

    console.log('JWT 토큰 생성:', {
      timestamp: new Date().toISOString(),
      payload: payload,
    });

    const access_token = this.jwtService.sign(payload);
    console.log('JWT 토큰 생성 완료:', {
      timestamp: new Date().toISOString(),
      token: access_token.substring(0, 20) + '...',
    });

    return {
      access_token,
      user: {
        userId: user.userId,
        name: user.name,
        email: user.email,
      },
    };
  }
}
