import { IsEnum, IsNumber } from 'class-validator';

export class UpdateAttendanceDto {
    @IsNumber()
    attendanceId: number;

    @IsEnum(['present', 'absent', 'late'])
    newField: 'present' | 'absent' | 'late';
}
