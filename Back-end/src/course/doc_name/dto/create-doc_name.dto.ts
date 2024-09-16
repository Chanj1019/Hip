import { IsString, MaxLength, IsOptional } from 'class-validator'


export class CreateDocNameDto {
    @IsString()
    @MaxLength(255)
    topic_title: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    pa_topic_title?: string;
}