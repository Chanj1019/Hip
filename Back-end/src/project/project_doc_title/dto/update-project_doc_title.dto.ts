import { IsString, IsOptional, IsInt, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class UpdateProjectDocTitleDto {
    @IsNotEmpty()
    @IsString()
    project_doc_title?: string;
}