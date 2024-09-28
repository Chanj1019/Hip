import { IsString, IsOptional, Length } from 'class-validator';

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    @Length(0, 10)
    course_title?: string;  

    @IsString()
    @IsOptional()
    @Length(0, 100)
    description?: string; 

    @IsString()
    @IsOptional()
    @Length(0, 40)
    instructor_name?: string; 

    @IsString()
    @IsOptional()
    @Length(0, 100)
    course_notice?: string;
}