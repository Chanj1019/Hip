import { IsString,IsNotEmpty,IsDateString,IsOptional } from 'class-validator';


export class CreateExhibitionDto {
    @IsString()
    @IsNotEmpty()
    generation: string;

    @IsString()
    @IsNotEmpty()
    exhibition_title: string;

    @IsString()
    description: string;


}
