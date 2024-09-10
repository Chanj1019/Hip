import { Module } from '@nestjs/common';
import { VideoTopicService } from './video_topic.service';
import { VideoTopicController } from './video_topic.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VideoTopic } from './entities/video_topic.entity'

@Module({
  imports: [
    TypeOrmModule.forFeature([VideoTopic]),
    
  ],
  controllers: [VideoTopicController],
  providers: [VideoTopicService],
})
export class VideoTopicModule {}
