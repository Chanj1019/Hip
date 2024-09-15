import {IsString, MaxLength, IsOptional} from 'class-validator'

export class CreateVideoTopicDto {
    @IsString()
    @MaxLength(255)
    video_topic_title: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    video_pa_topic_title?: string;
}