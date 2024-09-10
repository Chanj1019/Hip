import { Injectable } from '@nestjs/common';
import { CreateVideoTopicDto } from './dto/create-video_topic.dto';
import { UpdateVideoTopicDto } from './dto/update-video_topic.dto';

@Injectable()
export class VideoTopicService {
  create(createVideoTopicDto: CreateVideoTopicDto) {
    return 'This action adds a new videoTopic';
  }

  findAll() {
    return `This action returns all videoTopic`;
  }

  findOne(id: number) {
    return `This action returns a #${id} videoTopic`;
  }

  update(id: number, updateVideoTopicDto: UpdateVideoTopicDto) {
    return `This action updates a #${id} videoTopic`;
  }

  remove(id: number) {
    return `This action removes a #${id} videoTopic`;
  }
}
