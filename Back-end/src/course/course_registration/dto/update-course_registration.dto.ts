import { IsOptional, IsEnum } from 'class-validator';
import { Registration } from '../../../enums/role.enum';

export class CreateProjectRegistrationDto {

    @IsOptional()
    @IsEnum(Registration)
    course_registration_status?: Registration;
}
