import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { Exhibition } from 'src/exhibitions/exhibition.entity';
import { ExhibitionService } from 'src/exhibitions/exhibitions.service';
import { ExhibitionsMemberController } from './exhibitions_member.controller';
@Module({
  imports: [
    TypeOrmModule.forFeature([ExhibitionMember, Exhibition]),
    
  ],
  providers: [ExhibitionsMemberService,ExhibitionService],
  exports: [ExhibitionsMemberService],
  controllers: [ExhibitionsMemberController],
})
export class ExhibitionsMemberModule {}
