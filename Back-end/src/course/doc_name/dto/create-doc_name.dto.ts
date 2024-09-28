import { IsString, IsOptional, Length } from 'class-validator'

export class CreateDocNameDto {
    @IsString()
    @Length(0, 20)
    topic_title: string;

    @IsString()
    @IsOptional()
    @Length(0, 20)
    pa_topic_title?: string;
}