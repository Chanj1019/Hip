// CreateRequestCourseRegistrationDto.ts
import { IsNotEmpty, IsEnum } from 'class-validator';
import { Registration } from '../../../enums/role.enum';
import { Transform } from 'class-transformer';

export class CreateRequestCourseRegistrationDto {

    @IsNotEmpty()
    @IsEnum(Registration)
    @Transform(({ value }) => value || Registration.PENDING) // 기본값을 PENDING으로 설정
    course_registration_status: Registration;

    @IsNotEmpty() // 필수 필드로 설정
    course_reporting_date: string; // ISO 형식의 날짜 문자열
}