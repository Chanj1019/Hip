import { Module } from '@nestjs/common';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { ExhibitionsMemberController } from './exhibitions_member.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionMember } from './entities/exhibition_member.entity';
@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionMember])],
  controllers: [ExhibitionsMemberController],
  providers: [ExhibitionsMemberService],
})
export class ExhibitionsMemberModule {}
