import { Module } from '@nestjs/common';
import { ProjectDocService } from './project_doc.service';
import { ProjectDocController } from './project_doc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDoc } from './entities/project_doc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectDoc])
  ],
  controllers: [ProjectDocController],
  providers: [ProjectDocService],
  exports: [ProjectDocService]
})
export class ProjectDocModule {}