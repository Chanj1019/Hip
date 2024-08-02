import { Module } from '@nestjs/common';
import { ExhibitionService } from './exhibition.service';
import { ExhibitionController } from './exhibition.controller';

@Module({
  providers: [ExhibitionService],
  controllers: [ExhibitionController]
})
export class ExhibitionModule {}
