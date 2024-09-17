import { IsString, IsOptional } from 'class-validator';

export class UpdateCourseDto {
    @IsString()
    @IsOptional()
    course_title?: string;  

    @IsString()
    @IsOptional()
    description?: string; 

    @IsString()
    @IsOptional()
    instructor_name?: string; 

    @IsString()
    @IsOptional()
    course_notice?: string;
}