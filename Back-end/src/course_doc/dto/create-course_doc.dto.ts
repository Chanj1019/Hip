import {IsString, IsNotEmpty, MaxLength, IsOptional, IsDate} from 'class-validator'
export class CreateCourseDocDto {
    @IsDate()
    @IsNotEmpty()
    upload_data: Date = new Date(); // 자동

    @IsString()
    @IsOptional()
    file_path?: string;

    @IsString()
    @IsOptional()
    @MaxLength(100)
    course_document_description?: string;

    @IsOptional()
    file?: Express.Multer.File; 
}