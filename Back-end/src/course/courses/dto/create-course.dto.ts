import { IsString, IsNotEmpty, IsOptional } from 'class-validator'

export class CreateCourseDto {
    @IsString()
    @IsNotEmpty()
    course_title: string;
  
    @IsString()
    @IsNotEmpty()
    description: string;
  
    @IsString()
    @IsNotEmpty()
    instructor_name: string;

    @IsString()
    @IsOptional()
    course_notice?: string;
  }