import { PartialType } from '@nestjs/mapped-types';
import { CreateVideoTopicDto } from './create-video_topic.dto';
import { IsString, IsOptional, Length } from 'class-validator'

export class UpdateVideoTopicDto extends PartialType(CreateVideoTopicDto) {
    @IsString()
    @IsOptional()
    @Length(0, 20)
    video_topic_title?: string;

    @IsString()
    @IsOptional()
    @Length(0, 20)
    pa_topic_title?: string;
}
