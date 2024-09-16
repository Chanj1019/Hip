import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExhibitionsDocDto {

    @IsOptional() 
    @IsString()
    feedback?: string; 

    @IsNotEmpty()
    exhibition_id: number;
}


