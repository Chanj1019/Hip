import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { ProjectDoc } from '../project_doc/entities/project_doc.entity';
import { UsersModule } from '../../user/users.module';
import { ProjectsModule } from '../projects/projects.module';
import { Project } from '../projects/entities/project.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Feedback, ProjectDoc, Project]),
    forwardRef(() => UsersModule), forwardRef(() => ProjectsModule),
    ],
    controllers: [FeedbackController],
    providers: [FeedbackService],
    exports: [FeedbackService]
})
export class FeedbackModule {}
