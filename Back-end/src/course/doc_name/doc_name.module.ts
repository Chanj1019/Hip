import { Module } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { DocNameController } from './doc_name.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseDoc } from '../../course/course_doc/entities/course_doc.entity'
import { Course } from '../courses/entities/course.entity'
import { DocName } from './entities/doc_name.entity'
import { UsersModule } from '../../user/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, CourseDoc, DocName]),
    UsersModule
  ],
  controllers: [DocNameController],
  providers: [DocNameService],
})
export class DocNameModule {}
