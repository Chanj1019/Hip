import { Module } from '@nestjs/common';
import { CourseDocService } from './course_doc.service';
import { CourseDocController } from './course_doc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseDoc } from '../course_doc/entities/course_doc.entity'
import {DocName} from '../doc_name/entities/doc_name.entity'
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule,
    TypeOrmModule.forFeature([CourseDoc, DocName]),
    
  ],
  controllers: [CourseDocController],
  providers: [CourseDocService],
})
export class CourseDocModule {}
