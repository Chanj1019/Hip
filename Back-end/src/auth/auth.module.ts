// auth.module.ts
import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../users/user.entity'; // User 엔티티 임포트
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';

@Module({
    imports: [
        TypeOrmModule.forFeature([User]), // User 엔티티를 TypeORM 모듈에 등록
        JwtModule.register({
            secret: process.env.JWT_SECRET, // 비밀 키 설정
            signOptions: { expiresIn: '1h' }, // 토큰 만료 시간 설정
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
