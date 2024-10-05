import { IsEnum, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
    @IsNumber()
    courseId: number;
}
