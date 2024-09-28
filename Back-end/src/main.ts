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

    app.enableCors()

    await app.listen(3000);
}
bootstrap();
