import { IsOptional, IsString } from 'class-validator';

export class UpdateExhibitionDto {
    @IsOptional()
    @IsString()
    exhibition_title?: string;

    @IsOptional()
    @IsString()
    generation?: string;

    @IsOptional()
    @IsString()
    description?: string;
}
