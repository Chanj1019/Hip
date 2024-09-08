import { Module } from '@nestjs/common';
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
})
export class UsersModule {}
