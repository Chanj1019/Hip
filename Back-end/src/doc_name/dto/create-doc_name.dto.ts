import {IsString, MaxLength, IsOptional, IsNumber} from 'class-validator'

export class CreateDocNameDto {
    @IsString()
    topic_title: string;

    @IsNumber()
    @IsOptional()
    pa_topic_id?: number;

    @IsOptional()
    @IsString()
    file_path?: string; 
}