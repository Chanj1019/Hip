import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDocDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(255)
    url: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    title: string;
}