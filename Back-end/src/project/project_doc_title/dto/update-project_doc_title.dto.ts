import { IsString, IsOptional, IsInt } from 'class-validator';

export class UpdateProjectDocDto {
    @IsOptional()
    @IsString()
    title?: string;
    
    @IsOptional()
    @IsString()
    description?: string;
}
