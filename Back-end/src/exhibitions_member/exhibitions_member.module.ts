import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { Exhibition } from 'src/exhibitions/exhibition.entity';
import { ExhibitionService } from 'src/exhibitions/exhibitions.service';
import { ExhibitionsMemberController } from './exhibitions_member.controller';
import { UsersModule } from '../users/users.module'; // UsersModule 임포트 추가

@Module({
  imports: [
    TypeOrmModule.forFeature([ExhibitionMember, Exhibition]),
    UsersModule, // UsersModule 추가
  ],
  providers: [ExhibitionsMemberService,ExhibitionService],
  exports: [ExhibitionsMemberService],
  controllers: [ExhibitionsMemberController],
})
export class ExhibitionsMemberModule {}
