import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoTopicDto } from './create-video_topic.dto';

export class UpdateVideoTopicDto extends PartialType(CreateVideoTopicDto) {}
