import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateProjectDocDto {

    @IsOptional()
    @IsString()
    project_material?: string;

    @IsOptional()
    @IsString()
    description?: string;

    @IsInt()
    project_id: number;
}
