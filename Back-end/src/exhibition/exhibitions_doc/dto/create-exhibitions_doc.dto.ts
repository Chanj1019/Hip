import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateExhibitionsDocDto {
    @IsNotEmpty()
    exhibition_id: number;
}


