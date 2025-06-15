import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DataSource } from 'typeorm';
import { User } from './users/user.entity';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 데이터베이스 연결
  const dataSource = app.get(DataSource);

  // 테스트 데이터 생성
  const userRepository = dataSource.getRepository(User);
  const existingUser = await userRepository.findOne({
    where: { userId: 'test' },
  });

  if (!existingUser) {
    const testUser = userRepository.create({
      userId: 'test',
      password: 'test123',
      name: '테스트유저',
    });
    await userRepository.save(testUser);
    console.log('테스트 유저 생성 완료');
  } else {
    console.log('테스트 유저가 이미 존재합니다.');
  }

  app.enableCors({
    origin: 'http://localhost:3000',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
