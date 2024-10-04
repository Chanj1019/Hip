import { IsEnum, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
    @IsNumber()
    courseId: number;

    @IsEnum(['present', 'absent', 'late'])
    field: 'present' | 'absent' | 'late';
}
