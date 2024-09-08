import { IsString, IsNotEmpty, IsEnum, IsOptional } from 'class-validator';
import { Role } from '../../enums/role.enum';

export class UpdateProjectDto {
    @IsOptional()
    @IsString()
    title?: string;

    @IsOptional()
    @IsString()
    team_name?: string;

}
