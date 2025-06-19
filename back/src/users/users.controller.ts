import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { RegisterUserDto } from './dto/register-user.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  async register(
    @Body()
    registerUserDto: RegisterUserDto,
  ) {
    try {
      console.log(registerUserDto);
      const user = await this.usersService.create(registerUserDto);
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

  @Get(':userId')
  @UseGuards(JwtAuthGuard)
  async getUserInfo(@Param('userId') userId: string) {
    try {
      console.log(`사용자 정보 요청: ${userId}`);
      const user = await this.usersService.findOne(userId);
      console.log(`사용자 정보 조회 성공: ${userId}, 이름: ${user.name}`);
      return {
        userId: user.userId,
        name: user.name,
        email: user.email,
      };
    } catch (error) {
      console.error(`사용자 정보 조회 실패: ${userId}`, error.message);
      throw new HttpException(
        error.message || '사용자 정보를 가져오는 중 오류가 발생했습니다.',
        HttpStatus.NOT_FOUND,
      );
    }
  }
}
