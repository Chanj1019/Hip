import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UCat } from '../ucat/entities/ucat.entity';
import {DocName} from '../doc_name/entities/topic.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, UCat, DocName]),
    
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}