import { IsString, IsNumber, IsOptional, Length } from 'class-validator'

export class CreateVideoTopicDto {
    @IsString()
    @IsOptional()
    @Length(0, 20)
    video_topic_title?: string;

    @IsNumber()
    @IsOptional()
    video_pa_topic_id?: number;
}