import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 유효성 검사 전역 설정
import { ValidationPipe, BadRequestException } from '@nestjs/common'; // BadRequestException 임포트 추가


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

    // 유효성 검사 전역 설정
    app.useGlobalPipes(new ValidationPipe({
      exceptionFactory: (errors) => new BadRequestException(errors),
      transform: true,
      whitelist: true,
      forbidNonWhitelisted: true,
    }));


  // CORS 설정
  app.enableCors({
    origin: 'http://localhost:4200', // 허용할 출처
    credentials: true, // 쿠키 및 인증 정보를 포함한 요청을 허용
  });

  await app.listen(3000);
}
bootstrap();
