import { IsOptional, IsEnum, IsDate } from 'class-validator';
import { Registration } from '../../../enums/role.enum';

export class UpdateRequestCourseRegistrationDto {
    @IsOptional()
    @IsEnum(Registration)
    course_registration_status?: Registration;

    @IsOptional()
    @IsDate()
    course_reporting_date?: Date;
}
