import {IsString, IsNotEmpty, MaxLength, IsOptional, IsDate} from 'class-validator'
export class CreateCourseDocDto {
    @IsDate()
    @IsOptional()
    upload_data?: Date = new Date(); // 자동

    @IsString()
    @IsOptional()
    @MaxLength(100)
    course_document_description?: string;

    @IsOptional()
    file?: Express.Multer.File; 
}