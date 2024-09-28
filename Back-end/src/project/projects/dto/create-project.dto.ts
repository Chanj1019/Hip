import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';
import { Status } from '../../../enums/role.enum';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    topic: string;

    @IsString()
    @IsNotEmpty()
    team_name: string;

    @IsEnum(Status)
    status: Status;
}
