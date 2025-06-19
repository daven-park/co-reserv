import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(RegisterUserDto): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(RegisterUserDto.password, salt);

    const user = this.usersRepository.create({
      userId: RegisterUserDto.userId,
      name: RegisterUserDto.userName,
      password: hashedPassword,
      email: RegisterUserDto.email,
    });

    // 회원가입 실패 예외처리
    if (!user) {
      throw new UnauthorizedException('회원가입 실패');
    }

    const savedUser = await this.usersRepository.save(user);
    console.log(`회원가입 성공: ${savedUser.userId} - ${savedUser.createdAt}`);

    return savedUser;
  }

  async findOne(userId: string): Promise<User> {
    try {
      console.log(`사용자 조회 시도: ${userId}`);
      const user = await this.usersRepository.findOne({
        where: { userId: userId },
      });

      if (!user) {
        console.log(`사용자 조회 실패: 사용자 없음 - ${userId}`);
        throw new NotFoundException(`사용자를 찾을 수 없습니다: ${userId}`);
      }

      console.log(`사용자 조회 성공: ${userId}`);
      return user;
    } catch (error) {
      console.error(`사용자 조회 오류: ${error.message}`);
      throw new NotFoundException(error.message);
    }
  }
}