import { Course } from '../entities/course.entity';
import { DocNameWithCourseDocResponseDto } from 'src/course/doc_name/dto/doc_name-with-coursedoc-response.dto';

export class CourseWithDocNameAndCourseDocResponseDto {
    course_title: string;
    description: string;
    instructor_name: string;
    course_notice: string;
    generation: string;
    docName: DocNameWithCourseDocResponseDto[];

    constructor(course: Course) {
        this.course_title = course.course_title;
        this.description = course.description;
        this.instructor_name = course.instructor_name;
        this.course_notice = course.course_notice;
        this.generation = course.generation;
        this.docName = course.docName 
            ? course.docName.map(docName => new DocNameWithCourseDocResponseDto(docName)) 
            : [];
    }
}