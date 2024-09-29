import { IsString, IsOptional, IsEnum } from 'class-validator';
import { ProjectStatus } from '../../../enums/role.enum'

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    topic?: string;

    @IsOptional()
    @IsString()
    class?: string;

    @IsOptional()
    @IsEnum(ProjectStatus)
    status?: ProjectStatus;

    @IsOptional()
    @IsString()
    team_name?: string;

    @IsOptional()
    @IsString()
    profile?: string;

    @IsOptional()
    @IsString()
    requirements?: string;
}
