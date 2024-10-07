import { IsNumber, IsString } from 'class-validator';

export class CheckAttendanceDto {
    @IsNumber()
    courseId: number;

    @IsString()
    inputCode: string; // 학생이 입력한 난수
}
