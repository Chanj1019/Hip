import { PartialType } from '@nestjs/mapped-types';
import {IsString, MaxLength, IsOptional, IsNumber} from 'class-validator'
import { CreateDocNameDto } from './create-doc_name.dto';

export class UpdateDocNameDto extends PartialType(CreateDocNameDto) {
    @IsString()
    topic_title: string;

    @IsNumber()
    @IsOptional()
    pa_topic_id?: number;

    @IsOptional()
    @IsString()
    file_path?: string; 
}