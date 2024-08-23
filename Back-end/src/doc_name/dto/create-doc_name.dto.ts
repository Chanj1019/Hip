import {IsString, MaxLength, IsOptional, IsNumber} from 'class-validator'

export class CreateDocNameDto {
    @IsNumber()
    course_id: number;

    @IsNumber()
    @IsOptional()
    @MaxLength(20)
    pa_topic_id?: number;

    @IsOptional()
    file_path?: Express.Multer.File; 
}