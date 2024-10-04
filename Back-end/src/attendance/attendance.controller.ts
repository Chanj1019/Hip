import { Controller, Post, Body, UseGuards, Req, Patch, Get, NotFoundException } from '@nestjs/common';
import { AttendanceService } from './attendance.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { CheckAttendanceDto } from './dto/check-attendance.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';
import { Attendance } from './entities/attendance.entity';

@Controller('attendance')
@UseGuards(JwtAuthGuard) // JWT 인증 가드 사용
export class AttendanceController {
    constructor(private readonly attendanceService: AttendanceService) {}

    // 강사가 난수를 생성하고 출석 기록을 저장하는 메서드
    @Post('generate-code')
    async generateAttendanceCode(@Body() body: CreateAttendanceDto, @Req() request): Promise<Attendance> {
        const userId = request.userId; // 강사의 ID
        const randomCode = AttendanceController.generateRandomCode(); // 난수 생성
        return this.attendanceService.createAttendance(body, userId, randomCode);
    }

    // 학생이 난수를 입력하여 출석 상태를 기록하는 메서드
    @Post('check')
    async checkAttendance(@Body() body: CheckAttendanceDto, @Req() request): Promise<boolean> {
        const userId = request.userId; // 학생의 ID
        const attendance = await this.attendanceService.findAttendance(body.courseId, userId);

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        // 입력한 난수와 저장된 난수 비교
        if (attendance.random_code === body.inputCode) {
            attendance.field = 'present'; // 출석 상태 변경
            await this.attendanceService.updateAttendanceStatus(attendance.attendance_id, attendance.field);
            return true; // 출석 성공
        } else {
            return false; // 출석 실패
        }
    }

    // 강사가 특정 학생의 출석 상태를 임의로 변경하는 메서드
    @Patch('update-status/student')
    async updateStudentAttendanceStatus(
        @Body() body: UpdateStudentAttendanceDto,
        @Req() request
    ): Promise<Attendance> {
        const userId = request.userId; // 강사의 ID
        // 권한 확인 로직을 추가할 수 있습니다.
        return this.attendanceService.updateAttendanceByStudentId(body);
    }

    // 난수 생성 함수
    private static generateRandomCode(): string {
        return Math.floor(1000 + Math.random() * 9000).toString(); // 4자리 난수 생성
    }
}
