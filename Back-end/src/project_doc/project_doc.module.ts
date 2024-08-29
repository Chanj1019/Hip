import { Module } from '@nestjs/common';
import { ProjectDocService } from './project_doc.service';
import { ProjectDocController } from './project_doc.controller';

@Module({
  providers: [ProjectDocService],
  controllers: [ProjectDocController]
})
export class ProjectDocModule {}
