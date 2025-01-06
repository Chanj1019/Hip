import { IsString, IsOptional, IsInt, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class UpdateProjectDocTitleDto {
    @IsNotEmpty()
    @IsString()
    project_doc_title?: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10000)
    project_doc_title_pa_id?: number;
}