import { IsString, IsOptional } from 'class-validator';

export class UpdateProjectDocDto {

    @IsOptional()
    @IsString()
    project_material?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
