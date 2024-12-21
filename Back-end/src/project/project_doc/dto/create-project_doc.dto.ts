import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDocDto {
    @IsNotEmpty()
    @IsString()
    project_doc_title: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;
}
