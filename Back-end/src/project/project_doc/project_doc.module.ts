import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectDoc } from './entities/project_doc.entity';
import { ProjectDocService } from './project_doc.service';
import { ProjectDocController } from './project_doc.controller';
import { Project } from '../projects/entities/project.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { UsersModule } from '../../user/users.module';
import { ProjectsModule } from '../projects/projects.module';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectDoc,Project,Feedback]),
    forwardRef(() => UsersModule), forwardRef(() => ProjectsModule),
    ProjectsModule],
    providers: [ProjectDocService],
    controllers: [ProjectDocController],
    exports: [ProjectDocService],
})
export class ProjectDocModule {}
