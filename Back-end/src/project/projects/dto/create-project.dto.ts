import { IsString, IsNotEmpty } from 'class-validator';

export class CreateProjectDto {
    @IsString()
    @IsNotEmpty()
    topic: string;

    @IsString()
    @IsNotEmpty()
    class: string;

    @IsString()
    @IsNotEmpty()
    generation: string;
}
