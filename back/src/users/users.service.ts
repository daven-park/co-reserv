import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

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

    if (user.password !== password) {
      // 실제로는 비밀번호 해싱 필요
      throw new UnauthorizedException(
        '아이디 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    return user;
  }
  async createTestUser() {
    const testUser = this.usersRepository.create({
      userId: 'test',
      password: 'test123',
      name: '테스트유저',
    });
    return this.usersRepository.save(testUser);
  }
}
