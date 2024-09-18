import { Module } from '@nestjs/common';
import { VideoTopicService } from './video_topic.service';
import { VideoTopicController } from './video_topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoTopic } from './entities/video_topic.entity'
import { Course } from '../courses/entities/course.entity';
import { Video } from '../video/entities/video.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Video, VideoTopic, Course])
    ],
    controllers: [VideoTopicController],
    providers: [VideoTopicService],
})
export class VideoTopicModule {}
