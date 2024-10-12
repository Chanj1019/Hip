import { CourseRegistration } from '../entities/course_registration.entity';
import { Registration } from '../../../enums/role.enum';
import { UseResponseDto } from '../../../user/dto/user-response.dto';
import { CourseResponseDto } from '../../courses/dto/course-response.dto';

export class GetAdminResponseCourseRegistrationDto {
    course_registration_status: Registration;
    course_reporting_date: Date;
    applicant: UseResponseDto;
    currentCourse: CourseResponseDto;

    constructor(registration: CourseRegistration) {
        this.course_registration_status = registration.course_registration_status; // 강의 신청 상태
        this.course_reporting_date = registration.course_reporting_date; // 강의 신청 날짜
        this.applicant = new UseResponseDto(registration.user); // 사용자 정보
        this.currentCourse = new CourseResponseDto(registration.course); // 강의 정보
    }
}