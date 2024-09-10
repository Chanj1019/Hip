import { PartialType } from '@nestjs/mapped-types';
import { CreateCourseDocDto } from './create-course_doc.dto';
import {IsString} from 'class-validator'


export class UpdateCourseDocDto extends PartialType(CreateCourseDocDto) {
    @IsString()
    topic?: string;

    @IsString()
    subtopic?: string;
}


