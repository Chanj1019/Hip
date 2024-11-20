import { CourseRegistationResponseDto } from 'src/course/course_registration/dto/courseregistation-response.dto.ts';
import { Course } from '../entities/course.entity';

export class CourseWithCourseRegistrationResponseDto {
    course_title: string;
    description: string;
    instructor_name: string;
    generation: string;
    course_notice: string;
    course_registration: CourseRegistationResponseDto[];

    constructor(course: Course) {
        this.course_title = course.course_title;
        this.description = course.description;
        this.instructor_name = course.instructor_name;
        this.generation = course.generation;
        this.course_notice = course.course_notice;
        this.course_registration = course.course_registrations
            ? course.course_registrations.map(course_registration => new CourseRegistationResponseDto(course_registration)) 
            : [];
    }
}