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

    // user 참고 부분

    @IsNotEmpty()
    @IsString() // user가 문자열인지 검증
    userName: string;

    @IsNotEmpty()
    @IsString()
    userId: string;

}
