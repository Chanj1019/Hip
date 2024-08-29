import { IsString, IsNotEmpty, IsEnum } from 'class-validator';
import { Role } from '../../enums/role.enum';

export class UpdateProjectDto {
    @IsString()
    @IsNotEmpty()
    title?: string;

    @IsString()
    @IsNotEmpty()
    team_name?: string;

    @IsEnum(Role)
    status?: Role;

}
