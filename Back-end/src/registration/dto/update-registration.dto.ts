import { Optional } from '@nestjs/common';
import { IsEnum, IsInt, IsOptional } from 'class-validator';

export enum Status {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

export class CreateRegistrationDto {

    @IsInt()
    @Optional()
    personnel?: number;

    @IsEnum(Status)
    @IsOptional()
    status?: Status;
}
