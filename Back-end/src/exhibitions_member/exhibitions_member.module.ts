import { Module } from '@nestjs/common';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { ExhibitionsMemberController } from './exhibitions_member.controller';

@Module({
  controllers: [ExhibitionsMemberController],
  providers: [ExhibitionsMemberService],
})
export class ExhibitionsMemberModule {}
