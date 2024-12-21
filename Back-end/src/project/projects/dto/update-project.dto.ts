import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '../../../enums/role.enum'

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    topic?: string;

    @IsOptional()
    @IsString()
    className?: string;

    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @IsOptional()
    @IsString()
    team_name?: string;

    @IsOptional()
    @IsString()
    generation?: string;
}
