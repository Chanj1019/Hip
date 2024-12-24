import { PartialType } from '@nestjs/mapped-types';
import { CreateProjectDocDto } from './create-project_doc.dto';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class UpdateProjectDocDto extends PartialType(CreateProjectDocDto) {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    url: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    title: string;
}