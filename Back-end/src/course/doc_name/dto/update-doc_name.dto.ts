import { PartialType } from '@nestjs/mapped-types';
import { IsString, MaxLength, IsOptional } from 'class-validator'
import { CreateDocNameDto } from './create-doc_name.dto';

export class UpdateDocNameDto extends PartialType(CreateDocNameDto) {
    @IsString()
    @IsOptional()
    @MaxLength(255)
    topic_title?: string;

    @IsString()
    @IsOptional()
    @MaxLength(255)
    pa_topic_title?: string;
}