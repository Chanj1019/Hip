import { IsNotEmpty, IsString } from 'class-validator';

export class CreateProjectDocTitleDto {
    @IsNotEmpty()
    @IsString()
    title: string;
    
    @IsNotEmpty()
    @IsString()
    description: string;
}
