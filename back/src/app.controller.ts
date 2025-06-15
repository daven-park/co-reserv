import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('login')
  async login(@Body() loginData: { userId: string; password: string }) {
    try {
      return await this.appService.login(loginData);
    } catch (error) {
      throw new HttpException(
        error.message || '로그인 처리 중 오류가 발생했습니다.',
        HttpStatus.UNAUTHORIZED,
      );
    }
  }
}
