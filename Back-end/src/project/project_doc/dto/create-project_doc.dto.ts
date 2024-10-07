import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDocDto {
    @IsNotEmpty()
    @IsString()
    description: string;

    @IsNotEmpty()
    @IsString()
    projectId: number;
}
