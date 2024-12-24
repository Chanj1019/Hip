import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDocTitle } from './entities/project_doc_title.entity';
import { ProjectDocService } from './project_doc_title.service';
import { ProjectDocController } from './project_doc_title.controller';
import { Project } from '../projects/entities/project.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { UsersModule } from '../../user/users.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
    imports: [
        TypeOrmModule
        .forFeature([ProjectDocTitle, Project, Feedback]),
        forwardRef(() => UsersModule), 
        forwardRef(() => ProjectsModule),
        ProjectsModule
    ],
    providers: [ProjectDocService],
    controllers: [ProjectDocController],
    exports: [ProjectDocService],
})
export class ProjectDocModule {}
