import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from './dto/login-dto';
import { Response } from 'express';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('login')
  async login(@Body() loginDto: LoginDto) {
    try {
      // 사용자 검증
      const validatedUser = await this.authService.validateUser(
        loginDto.userId,
        loginDto.password,
      );

      if (!validatedUser) {
        throw new UnauthorizedException('인증에 실패했습니다.');
      }

      // 토큰 생성
      const { access_token, user } = await this.authService.login(validatedUser);

      return {
        success: true,
        access_token,
        user: {
          userId: user.userId,
          name: user.name,
          email: user.email,
        },
      };
    } catch (error) {
      console.error('로그인 오류:', error.message);
      throw new UnauthorizedException(error.message);
    }
  }

  @Post('logout')
  async logout() {
    return { success: true };
  }

  @Get('check')
  @UseGuards(JwtAuthGuard)
  async checkAuth(@Request() req) {
    return {
      success: true,
      user: {
        userId: req.user.userId,
        name: req.user.name,
        email: req.user.email,
      },
    };
  }
}