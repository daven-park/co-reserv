import { Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async login(loginData: { userId: string; password: string }) {
    if (loginData.userId === 'test' && loginData.password === '1234') {
      return {
        success: true,
        message: '로그인 성공',
        userId: 'test',
        // 토큰 발급 추가
      };
    }
    throw new UnauthorizedException(
      '아이디 또는 비밀번호가 일치하지 않습니다.',
    );
  }
}
