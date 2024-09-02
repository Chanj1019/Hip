// exhibitions_doc.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionsDocController } from './exhibitions_doc.controller';
import { ExhibitionsDocService } from './exhibitions_doc.service';
import { ExhibitionDoc } from './entities/exhibition_doc.entity';
import { Exhibition } from 'src/exhibitions/exhibition.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ExhibitionDoc, Exhibition])],
  controllers: [ExhibitionsDocController],
  providers: [ExhibitionsDocService],
})
export class ExhibitionsDocModule {}
