import { IsString, IsOptional, Length, IsNumber } from 'class-validator'

export class CreateVideoTopicDto {
    @IsString()
    @Length(0, 20)
    video_topic_title: string;

    @IsNumber()
    @IsOptional()
    video_pa_topic_id?: number;
}