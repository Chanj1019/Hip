import { Module } from '@nestjs/common';
import { VideoTopicService } from './video_topic.service';
import { VideoTopicController } from './video_topic.controller';

@Module({
  controllers: [VideoTopicController],
  providers: [VideoTopicService],
})
export class VideoTopicModule {}
