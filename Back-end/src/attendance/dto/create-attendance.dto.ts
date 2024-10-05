import { IsEnum, IsNumber } from 'class-validator';

export class CreateAttendanceDto {
    @IsNumber()
    courseId: number;

    @IsEnum(['present', 'absent', 'late'])
    field: 'present' | 'absent' | 'late';

    constructor(partial: Partial<CreateAttendanceDto>) {
        Object.assign(this, partial);
        this.field = this.field || 'absent'; // field의 기본값을 'absent'로 설정
    }
}
