import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; 
import { HashService } from '../hash/hash.service';

import * as dotenv from 'dotenv';
dotenv.config();

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
  ],
  providers: [UsersService,HashService],
  controllers: [UsersController],
  exports: [UsersService],
  import { ProjectsModule } from '../projects/projects.module'; // ProjectsModule 임포트
//손정민 작성
 @Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ProjectsModule), // ProjectsModule을 forwardRef로 임포트
  ],
  providers: [UsersService,HashService],
  controllers: [UsersController],
  exports: [UsersService,HashService], // 필요한 경우 UsersService를 내보냄


})
export class UsersModule {}
