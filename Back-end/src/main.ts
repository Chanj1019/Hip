import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
// 유효성 검사 전역 설정
import { ValidationPipe, BadRequestException, Logger } from '@nestjs/common'; // BadRequestException 임포트 추가
import * as bodyParser from 'body-parser';
import * as fs from 'fs';
import * as https from 'https'; // https 모듈 추가
import * as cookieParser from 'cookie-parser'
import * as dotenv from 'dotenv';

dotenv.config();

async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.use(cookieParser());
    // app.enableCors();
    // 유효성 검사 전역 설정
    app.useGlobalPipes(new ValidationPipe({
        exceptionFactory: (errors) => new BadRequestException(errors),
        transform: true,
        whitelist: true,
        forbidNonWhitelisted: true,
    }));

    // 최대 요청 크기 설정 (예: 10MB)
    app.use(bodyParser.json({ limit: '10mb' }));
    app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));

    // CORS 설정
    app.enableCors({
        origin: [
                'http://localhost:4200',
                'https://d2r1i81lny2w8r.cloudfront.net', // CloudFront 도메인
                'https://boardapp.site', // 커스텀 도메인
                'https://www.boardapp.site', 
                'http://hipacademy.site.s3-website.ap-northeast-2.amazonaws.com'
                ],// www 커스텀 도메인  // 특정 출처를 명시
                methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
                exposedHeaders: ['Authorization'], // 이 부분 추가
                credentials: true,  // 'withCredentials'를 사용하려면 'true'로 설정
                });

                            // HTTPS 옵션 설정
                const httpsOptions = {
                    key: fs.readFileSync('/etc/letsencrypt/live/api.hipacademy.site/privkey.pem'),
                    cert: fs.readFileSync('/etc/letsencrypt/live/api.hipacademy.site/fullchain.pem'),
                };

                // HTTPS 서버 생성
                const server = https.createServer(httpsOptions, app.getHttpAdapter().getInstance());

                // NestJS 애플리케이션을 HTTPS 서버에 연결 (HTTPS 적용)
                server.listen(process.env.HTTPS_SERVER_PORT, ()=> {
                    Logger.log(`Application Running on [SECURED] https://api.hipacademy.site:${process.env.HTTPS_SERVER_PORT}`);
                });

                // NestJS 애플리케이션 시작 (HTTPS 기존)
                await app.listen(process.env.HTTP_SERVER_PORT, ()=> {
                    Logger.log(`Application Running on [BASIC] http://localhost:${process.env.HTTP_SERVER_PORT}`);
                });


    await app.listen(3000);
}
bootstrap();
