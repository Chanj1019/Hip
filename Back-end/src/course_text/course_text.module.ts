import { Module } from '@nestjs/common';
import { CourseTextService } from './course_text.service';
import { CourseTextController } from './course_text.controller';

@Module({
  controllers: [CourseTextController],
  providers: [CourseTextService],
})
export class CourseTextModule {}
