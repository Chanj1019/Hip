import { IsNotEmpty, IsEnum, IsDateString } from 'class-validator';
import { Registration } from '../../../enums/role.enum';
import { CourseRegistration } from '../entities/course_registration.entity';

export class CreateResponseCourseRegistrationDto {
    @IsNotEmpty()
    @IsDateString()
    course_reporting_date: string;  // 수강 신청 날짜 (문자열로 변환됨)

    @IsEnum(Registration)
    course_registration_status: Registration;  // 수강 신청 상태

    // 생성자: CourseRegistration 객체에서 초기화
    constructor(courseRegistration: CourseRegistration) {
        this.course_reporting_date = courseRegistration.course_reporting_date.toISOString(); // ISO 문자열로 변환
        this.course_registration_status = courseRegistration.course_registration_status;
    }
}