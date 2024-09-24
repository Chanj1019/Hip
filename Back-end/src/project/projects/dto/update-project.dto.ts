import { IsString, IsOptional, IsEnum } from 'class-validator';
import { Status } from '../../../enums/role.enum'

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    topic?: string;

    @IsOptional()
    @IsString()
    team_name?: string;

    @IsOptional()
    @IsEnum(Status)
    status?: Status;
}
