import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { Exhibition } from 'src/exhibitions/exhibition.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExhibitionMember, Exhibition]),
  ],
  providers: [ExhibitionsMemberService],
  exports: [ExhibitionsMemberService],
})
export class ExhibitionsMemberModule {}
