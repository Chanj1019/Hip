import { Module } from '@nestjs/common';
import { VideoService } from './video.service';
import { VideoController } from './video.controller';
import { Video } from './entities/video.entity';
import { VideoTopic } from '../video_topic/entities/video_topic.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { OpenaiModule } from 'src/openai/openai.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Video, VideoTopic, Course]),
        OpenaiModule
    ],
    controllers: [VideoController],
    providers: [VideoService],
})
export class VideoModule {}
