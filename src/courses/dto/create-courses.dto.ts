// create-course.dto.ts
import { IsString, IsNumber, IsDateString } from 'class-validator';

export class CreateCourseDto {
  @IsString()
  course_title: string;

  @IsString()
  description: string;

  @IsNumber()
  instructor_id: number;

}
