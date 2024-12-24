import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDocTitle } from './entities/project_doc_title.entity';
import { Project } from '../projects/entities/project.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { UsersModule } from '../../user/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { ProjectDocTitleService } from './project_doc_title.service';
import { ProjectDocTitleController } from './project_doc_title.controller';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectDocTitle, Project, Feedback]),
        forwardRef(() => UsersModule), 
        forwardRef(() => ProjectsModule),
    ],
    providers: [ProjectDocTitleService],
    controllers: [ProjectDocTitleController],
    exports: [ProjectDocTitleService],
})
export class ProjectDocModule {}
