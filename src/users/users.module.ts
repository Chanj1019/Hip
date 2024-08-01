import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; 
import { HashService } from '../hash/hash.service';
@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    
  ],
  providers: [UsersService,HashService],
  controllers: [UsersController]
})
export class UsersModule {}
