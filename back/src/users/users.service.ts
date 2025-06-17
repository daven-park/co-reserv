import { Injectable, UnauthorizedException } from '@nestjs/common';
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

  async login(userId: string, password: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { userId } });

    if (!user) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    return user;
  }

  async register(
    userId: string,
    userName: string,
    password: string,
    email: string,
  ): Promise<User> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = await this.usersRepository.create({
      userId: userId,
      name: userName,
      password: hashedPassword,
      email: email,
    });

    // 회원가입 실패 예외처리
    if (!user) {
      throw new UnauthorizedException('회원가입 실패');
    }

    console.log(`회원가입 성공 : ${user.userId} - ${user.createdAt}`);

    return this.usersRepository.save(user);
  }
}
