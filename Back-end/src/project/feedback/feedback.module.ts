import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { UsersModule } from '../../user/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { Project } from '../projects/entities/project.entity';
import { ProjectDoc } from '../project_doc/entities/project_doc.entity';
import { ProjectDocTitle } from '../project_doc_title/entities/project_doc_title.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Feedback, ProjectDoc, Project, ProjectDocTitle]),
    forwardRef(() => UsersModule), forwardRef(() => ProjectsModule),
    ],
    controllers: [FeedbackController],
    providers: [FeedbackService],
    exports: [FeedbackService]
})
export class FeedbackModule {}
