import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateProjectDocDto {
    @IsOptional()
    @IsString()
    project_doc_title?: string;
    
    @IsOptional()
    @IsString()
    description?: string;
}
