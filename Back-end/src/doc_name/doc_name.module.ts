import { Module } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { DocNameController } from './doc_name.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseDoc } from '../course_doc/entities/course_doc.entity'
import { Course } from '../courses/entities/course.entity'
import { DocName } from './entities/doc_name.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseDoc, DocName]),
    
  ],
  controllers: [DocNameController],
  providers: [DocNameService],
})
export class DocNameModule {}
