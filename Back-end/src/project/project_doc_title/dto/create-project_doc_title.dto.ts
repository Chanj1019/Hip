import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateProjectDocTitleDto {
    @IsNotEmpty()
    @IsString()
    project_doc_title: string;
}
