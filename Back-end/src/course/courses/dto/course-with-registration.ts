import { Course } from '../entities/course.entity';
import { GetAdminResponseCourseRegistrationDto } from '../../course_registration/dto/get-admin-course_registration.dto'

export class CourseWithCourseRegistrationResponseDto {
    course_title: string;
    description: string;
    instructor_name: string;
    course_notice: string;
    generation: string;
    course_registration: GetAdminResponseCourseRegistrationDto[];

    constructor(course: Course) {
        this.course_title = course.course_title;
        this.description = course.description;
        this.instructor_name = course.instructor_name;
        this.course_notice = course.course_notice;
        this.generation = course.generation;
        this.course_registration = course.course_registrations
            ? course.course_registrations.map(course_registration => new GetAdminResponseCourseRegistrationDto(course_registration)) 
            : [];
    }
}