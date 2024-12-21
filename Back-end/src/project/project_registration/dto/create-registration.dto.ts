import { IsNotEmpty, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { Registration } from '../../../enums/role.enum';

export class CreateProjectRegistrationDto {
    @IsEnum(Registration)
    registration_status: Registration;
}
