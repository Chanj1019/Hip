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

    // // 출석 기록 조회
    // async findAttendance(courseId: number, userId: number): Promise<Attendance> {
    //     const attendance = await this.attendanceRepository.findOne({
    //         where: { course: { course_id: courseId }, user: { user_id: userId } },
    //     });

    //     if (!attendance) {
    //         throw new NotFoundException('Attendance record not found');
    //     }

    //     return attendance;
    // }

    // // 출석 상태 업데이트
    // async updateAttendanceStatus(attendanceId: number, newField: 'present' | 'absent' | 'late'): Promise<Attendance> {
    //     const attendance = await this.attendanceRepository.findOne({ where: { attendance_id: attendanceId } });

    //     if (!attendance) {
    //         throw new NotFoundException('Attendance record not found');
    //     }

    //     attendance.field = newField; // 새로운 출석 상태로 변경
    //     return this.attendanceRepository.save(attendance);
    // }

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

    async checkAttendance(courseId: number, userId: number, inputCode: string): Promise<boolean> {
        const attendance = await this.findAttendance(courseId, userId);

        // 입력한 난수와 저장된 난수 비교
        if (attendance.random_code === inputCode) {
            await this.updateAttendanceStatus(attendance.attendance_id, 'present'); // 출석 상태 변경
            return true; // 출석 성공
        } else {
            return false; // 출석 실패
        }
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

    async createAttendanceForApprovedStudents(courseId: number, randomCode: string): Promise<Attendance[]> {
        // 승인된 학생 조회
        const approvedRegistrations = await this.courseRegistrationRepository
            .createQueryBuilder('registration')
            .leftJoinAndSelect('registration.user', 'user') // 사용자와 조인
            .where('registration.course_id = :courseId', { courseId })
            .andWhere('registration.course_registration_status = :status', { status: Registration.APPROVED })
            .getMany(); // 여러 개의 결과 가져오기
    
        // 출석 기록 생성 및 저장
        const attendances: Attendance[] = [];
        for (const registration of approvedRegistrations) {
            const attendance = this.attendanceRepository.create({
                course: { course_id: courseId }, // course_id로 Course 엔티티 참조
                user: registration.user, // 사용자 엔티티 참조
                attendance_date: new Date(),
                field: 'absent', // 기본값: 'absent'
                random_code: randomCode, // 생성된 난수 저장
            });
            attendances.push(await this.attendanceRepository.save(attendance));
        }
    
        return attendances; // 생성된 출석 기록 반환
    }
}
