import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateProjectDocTitleDto {
    @IsNotEmpty()
    @IsString()
    project_doc_title: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10000)
    project_doc_pa_title_id?: number;
}
