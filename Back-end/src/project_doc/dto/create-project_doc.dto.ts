import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';

export class CreateProjectDocDto {

    @IsString()
    description: string;

    @IsString()
    project_id: number;

    // @IsInt()
    // userId: number;
}
