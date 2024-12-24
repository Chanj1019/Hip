import { Module } from '@nestjs/common';
import { ProjectKeyDocService } from './project_key_doc.service';
import { ProjectKeyDocController } from './project_key_doc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectKeyDoc } from './entities/project_key_doc.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([ProjectKeyDoc]), 
  ],
  controllers: [ProjectKeyDocController],
  providers: [ProjectKeyDocService],
})
export class ProjectKeyDocModule {}
