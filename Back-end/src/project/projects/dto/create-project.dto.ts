import { IsString, IsNotEmpty, IsEnum, IsInt } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    topic: string;

    @IsString()
    @IsNotEmpty()
    class: string;
}
