import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 유효성 검사 전역 설정
import { ValidationPipe, BadRequestException } from '@nestjs/common'; // BadRequestException 임포트 추가


async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // app.enableCors();
    // 유효성 검사 전역 설정
    app.useGlobalPipes(new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));

    app.enableCors({
      origin: 'http://127.0.0.1:5500',
      methods: 'GET, POST, PUT, PATCH, DELETE, HEAD, OPTIONS',
      credentials: true,
    })

  await app.listen(3002);
}
bootstrap();
