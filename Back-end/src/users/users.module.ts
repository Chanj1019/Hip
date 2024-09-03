import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; 
import { HashService } from '../hash/hash.service';
import { JwtModule } from '@nestjs/jwt';
import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    JwtModule.register({
      secret: process.env.JWT_SECRET, // 환경 변수에서 비밀 키를 가져옵니다.
      signOptions: { expiresIn: '60s' }, // 필요한 설정
    }),
  ],
  providers: [UsersService,HashService],
  controllers: [UsersController]
})
export class UsersModule {}
