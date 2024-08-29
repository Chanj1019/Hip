import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';

export class CreateProjectDocDto {

    @IsString()
    feedback: string;

    @IsString()
    project_material: string;

    // @IsInt()
    // userId: number;
}
