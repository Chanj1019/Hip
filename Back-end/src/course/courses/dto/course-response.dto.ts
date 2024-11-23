import { Course } from '../entities/course.entity';

export class CourseResponseDto {
    course_title: string;
    description: string;
    instructor_name: string;
    course_notice: string;
    generation: string;

    constructor(course: Course) {
        this.course_title = course.course_title;
        this.description = course.description;
        this.instructor_name = course.instructor_name;
        this.course_notice = course.course_notice;
        this.generation = course.generation;
    }
}