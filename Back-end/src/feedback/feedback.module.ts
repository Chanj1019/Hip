import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Feedback } from './entities/feedback.entity';
import { FeedbackService } from './feedback.service';
import { FeedbackController } from './feedback.controller';
import { Project_doc } from '../project_doc/entities/project_doc.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Feedback, Project_doc])],
  controllers: [FeedbackController],
  providers: [FeedbackService],
})
export class FeedbackModule {}
