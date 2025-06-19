import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // CORS 설정 수정
  app.enableCors({
    origin: true, // 모든 출처 허용 (개발 환경에서만 사용)
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
    allowedHeaders: 'Content-Type, Accept, Authorization',
    exposedHeaders: ['Authorization'],
    preflightContinue: false,
    optionsSuccessStatus: 204,
  });

  app.useGlobalPipes(new ValidationPipe({ transform: true }));

  const port = process.env.PORT || 8000;
  await app.listen(port);
  console.log(`서버가 ${port} 포트에서 실행 중입니다.`);
}
bootstrap();