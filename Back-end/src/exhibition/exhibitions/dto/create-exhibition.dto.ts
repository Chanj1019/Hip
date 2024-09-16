import { IsString,IsNotEmpty,IsDateString,IsOptional } from 'class-validator';
export class CreateExhibitionDto {
    @IsString()
    @IsNotEmpty()
    generation: string;

    @IsString()
    @IsNotEmpty()
    exhibition_title: string;
    
    @IsString()
    @IsNotEmpty()
    team_name:string;

    @IsString()
    description: string;

    @IsNotEmpty()
    user_id:number;
}
