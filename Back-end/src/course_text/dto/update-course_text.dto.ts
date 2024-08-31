import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseTextDto } from './create-course_text.dto';

export class UpdateCourseTextDto extends PartialType(CreateCourseTextDto) {}
