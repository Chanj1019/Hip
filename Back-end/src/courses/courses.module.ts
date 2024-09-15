import { Module } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CoursesController } from './courses.controller';
import { Course } from './entities/course.entity'
import { TypeOrmModule } from '@nestjs/typeorm';
import { UCat } from '../ucat/entities/ucat.entity';
import {DocName} from '../doc_name/entities/doc_name.entity'
import { VideoTopic } from 'src/video_topic/entities/video_topic.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Course, UCat, DocName, VideoTopic]),
    
  ],
  providers: [CoursesService],
  controllers: [CoursesController],
})
export class CoursesModule {}