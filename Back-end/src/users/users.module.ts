import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; 
import { HashService } from '../hash/hash.service';
import { UCat } from '../ucat/entities/ucat.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([User, UCat]),
    
  ],
  providers: [UsersService,HashService],
  controllers: [UsersController]
})
export class UsersModule {}
