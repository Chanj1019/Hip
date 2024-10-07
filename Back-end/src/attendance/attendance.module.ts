import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AttendanceController } from './attendance.controller';
import { AttendanceService } from './attendance.service';
import { Attendance } from './entities/attendance.entity';
import { User } from '../user//user.entity'; // User 엔티티 임포트
import { Course } from '../course/courses/entities/course.entity'; // Course 엔티티 임포트
import { CourseRegistration } from 'src/course/course_registration/entities/course_registration.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Attendance, User, Course, CourseRegistration]), // Attendance, User, Course 엔티티를 TypeORM 모듈에 등록
    ],
    controllers: [AttendanceController],
    providers: [AttendanceService],
    exports: [AttendanceService], // 다른 모듈에서 서비스 사용 가능하도록 내보내기
})
export class AttendanceModule {}
