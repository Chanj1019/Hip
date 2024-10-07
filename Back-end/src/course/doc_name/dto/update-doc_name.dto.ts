import { PartialType } from '@nestjs/mapped-types';
import { IsNumber, IsString, IsOptional, Length, Min, Max } from 'class-validator'
import { CreateDocNameDto } from './create-doc_name.dto';

export class UpdateDocNameDto extends PartialType(CreateDocNameDto) {
    @IsString()
    @IsOptional()
    @Length(0, 20)
    topic_title?: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10000)
    pa_topic_id?: number;
}