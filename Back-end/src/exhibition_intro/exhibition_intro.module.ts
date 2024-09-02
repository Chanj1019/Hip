import { Module } from '@nestjs/common';
import { ExhibitionIntroService } from './exhibition_intro.service';
import { ExhibitionIntroController } from './exhibition_intro.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionIntro } from './entities/exhibition_intro.entity';
import { Exhibition } from 'src/exhibitions/exhibition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionIntro, Exhibition])],
  controllers: [ExhibitionIntroController],
  providers: [ExhibitionIntroService],
})
export class ExhibitionIntroModule {}
