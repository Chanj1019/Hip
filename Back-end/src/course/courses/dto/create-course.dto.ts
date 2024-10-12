import { IsString, IsNotEmpty, IsOptional, Length } from 'class-validator'

export class CreateCourseDto {
   @IsString()
   @IsNotEmpty()
   @Length(0, 50)
   course_title: string;
  
   @IsString()
   @IsNotEmpty()
   @Length(0, 100)
   description: string;
  
   @IsString()
   @IsNotEmpty()
   @Length(0, 40)
   instructor_name: string;

   @IsString()
   @IsOptional()
   @Length(0, 100)
   course_notice?: string;
}