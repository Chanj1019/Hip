import { IsString, IsOptional, IsInt, IsNumber, IsNotEmpty, Min, Max } from 'class-validator';

export class UpdateProjectDocTitleDto {
    @IsNotEmpty()
    @IsString()
    title?: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10000)
    pa_title_id?: number;
}