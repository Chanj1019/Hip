import { IsString, IsOptional, Length } from 'class-validator'

export class UpdateVideoTopicDto {
    @IsString()
    @Length(0, 20)
    video_topic_title: string;

    @IsString()
    @IsOptional()
    @Length(0, 20)
    video_pa_topic_id?: number;
}
