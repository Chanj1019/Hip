// src/user/dto/course.dto.ts
export class CourseDto {
    course_id: number;
    course_title: string;
    description: string;
    instructor_name: string;
    course_notice?: string;  // nullable 속성은 선택적
}
