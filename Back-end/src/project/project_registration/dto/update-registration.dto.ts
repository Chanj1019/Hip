import { IsEnum, IsOptional, IsString } from 'class-validator';
import { Registration } from '../../../enums/role.enum';
import { TeamRole } from '../../../enums/role.enum';

export class UpdateProjectRegistrationDto {
    @IsOptional()
    @IsEnum(Registration)
    registration_status?: Registration;

    @IsOptional()
    @IsString()
    project_role?: string;
    
    @IsOptional()
    @IsEnum(TeamRole)
    team_role?: TeamRole;
}
