import { IsNumber, IsString, IsOptional, Length, Min, Max } from 'class-validator'

export class CreateDocNameDto {
    @IsString()
    @Length(0, 20)
    topic_title: string;

    @IsNumber()
    @IsOptional()
    @Min(1)
    @Max(10000)
    pa_topic_id?: number;
}