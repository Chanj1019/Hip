import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CreateProjectDocTitleDto {
    @IsNotEmpty()
    @IsString()
    title: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10000)
    pa_title_id?: number;
}
