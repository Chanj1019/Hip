import { IsNotEmpty, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { Registration } from '../../../enums/role.enum';

export class CreateProjectRegistrationDto {

    @IsNotEmpty()
    @IsDateString()
    course_reporting_date: string;

    @IsNotEmpty()
    @IsEnum(Registration)
    course_registration_status: Registration;

    // user 주키
    @IsNotEmpty()
    @IsNumber()
    userId: number;

    // 강의 주키
    @IsNotEmpty()
    @IsNumber()
    courseId: number;

}
