import {IsString, MaxLength, IsOptional, IsNumber} from 'class-validator'

export class CreateDocNameDto {
    @IsString()
    topic_title: string;

    @IsString()
    @IsOptional()
    pa_topic_title?: string

    @IsOptional()
    @IsString()
    file_path?: string; 
}