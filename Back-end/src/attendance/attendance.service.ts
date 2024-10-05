import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';
import { User } from '../user/user.entity'; // User 엔티티 임포트
import { Course } from '../course/courses/entities/course.entity'; // Course 엔티티 임포트

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
    ) {}

    // async createAttendance(dto: CreateAttendanceDto, userId: number, randomCode: string, field: string): Promise<Attendance> {
    //     const user = await this.userRepository.findOne({ where: { user_id: userId } });
    //     const course = await this.courseRepository.findOne({ where: { course_id: dto.courseId } });

    //     if (!user || !course) {
    //         throw new NotFoundException('User or Course not found');
    //     }

    //     const attendance = this.attendanceRepository.create({
    //         course,
    //         user,
    //         attendance_date: new Date(),
    //         field: dto.field,
    //         random_code: randomCode,
    //     });

    //     return this.attendanceRepository.save(attendance);
    // }

    async createAttendance(courseId: number, userId: number, field: 'present' | 'absent' | 'late', randomCode: string): Promise<Attendance> {
        const user = await this.userRepository.findOne({ where: { user_id: userId } });
        const course = await this.courseRepository.findOne({ where: { course_id: courseId } });
    
        if (!user || !course) {
            throw new NotFoundException('User or Course not found');
        }
    
        const attendance = this.attendanceRepository.create({
            course,
            user,
            attendance_date: new Date(),
            field, // 출석 상태를 'absent'로 기본 설정
            random_code: randomCode,
        });
    
        return this.attendanceRepository.save(attendance);
    }
    
    async findAttendance(courseId: number, userId: number): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOne({
            where: { course: { course_id: courseId }, user: { user_id: userId } },
        });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        return attendance;
    }

    async updateAttendanceStatus(attendanceId: number, newField: 'present' | 'absent' | 'late'): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOne({ where: { attendance_id: attendanceId } });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        attendance.field = newField; // 새로운 출석 상태로 변경
        return this.attendanceRepository.save(attendance);
    }

    async updateAttendanceByStudentId(dto: UpdateStudentAttendanceDto): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOne({
            where: { course: { course_id: dto.courseId }, user: { user_id: dto.studentId } },
        });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found for the specified student.');
        }

        attendance.field = dto.newField; // 새로운 출석 상태로 변경
        return this.attendanceRepository.save(attendance);
    }

    async getUsersInCourse(courseId: number): Promise<User[]> {
        const course = await this.courseRepository.findOne({
            where: { course_id: courseId },
            relations: ['users'], // 자동 생성된 미들 테이블을 통해 사용자 목록을 가져옵니다.
        });
    
        return course ? course.user : []; // 수업에 등록된 사용자 목록 반환
    }
    
}
