import { IsNotEmpty, IsEnum, IsDateString, IsNumber } from 'class-validator';
import { Registration } from '../../../enums/role.enum';

export class CreateProjectRegistrationDto {

    @IsNotEmpty()
    @IsDateString()
    reporting_date: string;

    @IsNotEmpty()
    @IsEnum(Registration)
    registration_status: Registration;

    // user 주키

    @IsNotEmpty()
    @IsNumber()
    userId: number;

    // project 주키

    @IsNotEmpty()
    @IsNumber()
    projectId: number;

}
