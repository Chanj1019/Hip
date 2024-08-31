import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';

export class CreateProjectDocDto {

    @IsString()
    project_material: string;

    @IsString()
    description: string;

    // @IsInt()
    // userId: number;
}
