import { Module } from '@nestjs/common';
import { ExhibitionIntroService } from './exhibition_intro.service';
import { ExhibitionIntroController } from './exhibition_intro.controller';

@Module({
  controllers: [ExhibitionIntroController],
  providers: [ExhibitionIntroService],
})
export class ExhibitionIntroModule {}
