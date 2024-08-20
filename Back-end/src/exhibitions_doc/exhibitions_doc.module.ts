import { Module } from '@nestjs/common';
import { ExhibitionsDocService } from './exhibitions_doc.service';
import { ExhibitionsDocController } from './exhibitions_doc.controller';

@Module({
  controllers: [ExhibitionsDocController],
  providers: [ExhibitionsDocService],
})
export class ExhibitionsDocModule {}
