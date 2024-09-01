import { IsNotEmpty, IsEnum, IsInt } from 'class-validator';

export enum Status {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

export class CreateRegistrationDto {

    @IsInt()
    @IsNotEmpty()
    personnel: number;

    @IsEnum(Status)
    @IsNotEmpty()
    status: Status;
}
