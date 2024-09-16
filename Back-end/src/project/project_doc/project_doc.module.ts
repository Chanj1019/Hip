import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project_doc } from './entities/project_doc.entity';
import { ProjectDocService } from './project_doc.service';
import { ProjectDocController } from './project_doc.controller';
import { Project } from '../projects/entities/project.entity';
import { Feedback } from '../feedback/entities/feedback.entity';
import { UsersModule } from '../../user/users.module';

@Module({
    imports: [TypeOrmModule.forFeature([Project_doc,Project,Feedback]),
    UsersModule],
    providers: [ProjectDocService],
    controllers: [ProjectDocController],
    exports: [ProjectDocService],
})
export class ProjectDocModule {}
