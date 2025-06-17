import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('login')
  async login(@Body() loginData: { userId: string; password: string }) {
    try {
      const user = await this.usersService.login(
        loginData.userId,
        loginData.password,
      );
      return {
        success: true,
        message: '로그인 성공',
        userId: user.userId,
        name: user.name,
      };
    } catch (error) {
      throw new HttpException(
        error.message || '로그인 처리 중 오류가 발생했습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
  @Post('register')
  async register(
    @Body()
    registerData: {
      userId: string;
      userName: string;
      password: string;
      email: string;
    },
  ) {
    try {
      const user = await this.usersService.register(
        registerData.userId,
        registerData.userName,
        registerData.password,
        registerData.email,
      );
      return {
        success: true,
        message: `회원가입 성공 : ${user.userId}`,
      };
    } catch (error) {
      throw new HttpException(
        error.message || '회원가입 처리 중 오류가 발생했습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
