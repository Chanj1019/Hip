import { IsNotEmpty, IsEnum, IsDateString, IsString } from 'class-validator';
import { Registration } from '../../../enums/role.enum';

export enum Status {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

export class CreateProjectRegistrationDto {

    @IsNotEmpty()
    @IsDateString()
    reporting_date: string;

    @IsNotEmpty()
    @IsEnum(Registration)
    registration_status: Registration;

    // user 정보

    @IsNotEmpty()
    @IsString() // user가 문자열인지 검증
    user_name: string;

    @IsNotEmpty()
    @IsString()
    user_id: number;

    // project 정보

    @IsNotEmpty()
    @IsString()
    project_id: number;

}
