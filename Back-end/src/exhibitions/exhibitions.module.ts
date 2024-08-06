import { Module } from '@nestjs/common';
import { ExhibitionService } from './exhibitions.service';
import { ExhibitionController } from './exhibitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibition } from './exhibition.entity';
@Module({
  imports: [
    TypeOrmModule.forFeature([Exhibition]),
    
  ],
  providers: [ExhibitionService],
  controllers: [ExhibitionController]
})
export class ExhibitionModule {}
