import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project_doc } from './entities/project_doc.entity';
import { ProjectDocService } from './project_doc.service';
import { ProjectDocController } from './project_doc.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Project_doc])],
    providers: [ProjectDocService],
    controllers: [ProjectDocController],
    exports: [ProjectDocService],
})
export class ProjectDocModule {}
