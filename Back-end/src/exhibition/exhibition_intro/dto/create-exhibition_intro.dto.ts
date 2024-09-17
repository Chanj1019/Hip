import { IsNotEmpty, IsString } from 'class-validator';

export class CreateExhibitionIntroDto {
    @IsNotEmpty()
    exhibition_id: number;

    @IsNotEmpty()
    @IsString()
    introduce: string;
}
