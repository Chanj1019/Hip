import { Module } from '@nestjs/common';
import { CourseDocService } from './course_doc.service';
import { CourseDocController } from './course_doc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseDoc } from '../course_doc/entities/course_doc.entity'
import {DocName} from '../doc_name/entities/doc_name.entity'
import { ConfigModule } from '@nestjs/config';
import { Course } from 'src/courses/entities/course.entity';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../users/users.module';
@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([CourseDoc, DocName, Course]),
    UsersModule,
  ],
  controllers: [CourseDocController],
  providers: [CourseDocService, ConfigService],
})
export class CourseDocModule {}
