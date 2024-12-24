import { Module } from '@nestjs/common';
import { ProjectKeyDocService } from './project_key_doc.service';
import { ProjectKeyDocController } from './project_key_doc.controller';

@Module({
  controllers: [ProjectKeyDocController],
  providers: [ProjectKeyDocService],
})
export class ProjectKeyDocModule {}
