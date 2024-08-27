import {IsString, MaxLength, IsOptional, IsNumber} from 'class-validator'

export class CreateDocNameDto {
    @IsString()
    topic_title: string;

    @IsNumber()
    @IsOptional()
    pa_topic_title?: string | null;

    @IsOptional()
    @IsString()
    file_path?: string; 
}