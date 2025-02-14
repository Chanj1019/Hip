import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    topic: string;

    @IsString()
    @IsNotEmpty()
    className: string;

    @IsString()
    @IsNotEmpty()
    team_name: string;

    @IsString()
    @IsNotEmpty()
    generation: string;
}