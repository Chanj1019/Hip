import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Attendance } from './entities/attendance.entity';
import { CreateAttendanceDto } from './dto/create-attendance.dto';
import { UpdateStudentAttendanceDto } from './dto/update-student-attendance.dto';
import { User } from '../user/user.entity'; // User 엔티티 임포트
import { Course } from '../course/courses/entities/course.entity'; // Course 엔티티 임포트
import { CourseRegistration } from '../course/course_registration/entities/course_registration.entity'; // CourseRegistration 엔티티 임포트
import { Registration } from 'src/enums/role.enum';

@Injectable()
export class AttendanceService {
    constructor(
        @InjectRepository(Attendance)
        private attendanceRepository: Repository<Attendance>,
        @InjectRepository(User)
        private userRepository: Repository<User>,
        @InjectRepository(Course)
        private courseRepository: Repository<Course>,
        @InjectRepository(CourseRegistration)
        private courseRegistrationRepository: Repository<CourseRegistration>, // CourseRegistration 리포지토리 추가
    ) {}

    // 출석 기록 생성
    async createAttendance(courseId: number, userId: number, field: 'present' | 'absent' | 'late', randomCode: string): Promise<Attendance> {
        const user = await this.userRepository.findOne({ where: { user_id: userId } });
        const course = await this.courseRepository.findOne({ where: { course_id: courseId } });
        
        // 사용자 또는 수업이 존재하지 않으면 예외 처리
        if (!user || !course) {
            throw new NotFoundException('User or Course not found');
        }

        // 출석 기록 생성
        const attendance = this.attendanceRepository.create({
            course,
            user,
            attendance_date: new Date(),
            field,
            random_code: randomCode,
        });

        // 출석 기록 저장
        return this.attendanceRepository.save(attendance);
    }

    // 출석 기록 조회
    async findAttendance(courseId: number, userId: number): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOne({
            where: { course: { course_id: courseId }, user: { user_id: userId } },
        });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        return attendance;
    }

    // 출석 상태 업데이트
    async updateAttendanceStatus(attendanceId: number, newField: 'present' | 'absent' | 'late'): Promise<Attendance> {
        const attendance = await this.attendanceRepository.findOne({ where: { attendance_id: attendanceId } });

        if (!attendance) {
            throw new NotFoundException('Attendance record not found');
        }

        attendance.field = newField; // 새로운 출석 상태로 변경
        return this.attendanceRepository.save(attendance);
    }

    // 특정 학생의 출석 상태 업데이트
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
        const registrations = await this.courseRegistrationRepository.find({
            where: { 
                course: { course_id: courseId }, 
                course_registration_status: Registration.APPROVED // 'approved' 상태의 학생만 가져오기
            },
            relations: ['user'], // 사용자 정보를 가져옵니다.
        });
    
        return registrations.map(registration => registration.user); // 등록된 사용자 목록 반환
    }
    
}
