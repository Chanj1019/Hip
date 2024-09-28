import { PartialType } from '@nestjs/mapped-types';
import { IsString, IsOptional, Length } from 'class-validator'
import { CreateDocNameDto } from './create-doc_name.dto';

export class UpdateDocNameDto extends PartialType(CreateDocNameDto) {
    @IsString()
    @IsOptional()
    @Length(0, 20)
    topic_title?: string;

    @IsString()
    @IsOptional()
    @Length(0, 20)
    pa_topic_title?: string;
}