import { PartialType } from '@nestjs/mapped-types';
import {IsString, MaxLength, IsOptional, IsNumber} from 'class-validator'
import { CreateDocNameDto } from './create-doc_name.dto';

export class UpdateDocNameDto extends PartialType(CreateDocNameDto) {
    @IsNumber()
    course_id: number;

    @IsString()
    @MaxLength(20)
    topic?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    subtopic?: string;

    @IsOptional()
    file_path?: Express.Multer.File; 
}