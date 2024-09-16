import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoTopicDto } from './create-video_topic.dto';
import { IsString, MaxLength, IsOptional } from 'class-validator'

export class UpdateVideoTopicDto extends PartialType(CreateVideoTopicDto) {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    topic_title?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    pa_topic_title?: string;
}
