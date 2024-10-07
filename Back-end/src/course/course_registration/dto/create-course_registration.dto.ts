import { IsNotEmpty, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { Registration } from '../../../enums/role.enum';

export class CreateCourseRegistrationDto {

    @IsNotEmpty()
    @IsDateString()
    course_reporting_date: string;

    @IsNotEmpty()
    @IsEnum(Registration)
    course_registration_status: Registration;
}
