import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateCourseRegistrationDto } from './dto/create-course_registration.dto';
import { UpdateCourseRegistrationDto } from './dto/update-course_registration.dto';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { CourseRegistration } from './entities/course_registration.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from '../../user/user.entity';
import { ConflictException } from '@nestjs/common';

@Injectable()
export class CourseRegistrationService {
    constructor(
        @InjectRepository(CourseRegistration)
        private readonly courseRegistrationRepository: Repository<CourseRegistration>,
        @InjectRepository(Course)
        private readonly coursesRepository: Repository<Course>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ){}

    // 이미 수강신청이 되어 있는지 확인하는 함수
    async isEnrolled(courseId: number, userId: number): Promise<boolean> {
        const existingEnrollment = await this.courseRegistrationRepository.findOne({
            where: {
                course: { course_id: courseId }, // 프로젝트 ID로 필터링
                user: { user_id: userId }, // 사용자 ID로 필터링
            },
        });

        return !!existingEnrollment; // 이미 존재하면 true, 없으면 false
    }

    async create(createCourseRegistrationDto: CreateCourseRegistrationDto, loginedUser: number, courseId: number,) {
        // 이미 해당 프로젝트에 참가 신청이 되어 있을 때
        const isAlreadyEnrolled = await this.isEnrolled(courseId, loginedUser);

        if(isAlreadyEnrolled){
            throw new ConflictException('신청된 강의입니다.');
        }

        // 처음 참가 신청
        const courseRegistration = this.courseRegistrationRepository.create(createCourseRegistrationDto);
        courseRegistration.user = await this.userRepository.findOneBy({ user_id: loginedUser });  // 특정 사용자와 연결된 정보
        courseRegistration.course = await this.coursesRepository.findOneBy({ course_id: courseId });  // 특정 프로젝트와 연결된 정보
        if (!courseRegistration.user || !courseRegistration.course) {
            throw new NotFoundException('사용자 또는 강의를 찾을 수 없습니다.');
        }
        return await this.courseRegistrationRepository.save(courseRegistration);
    }

    async findAll(): Promise<CourseRegistration[]> {
        return this.courseRegistrationRepository.find();
    }

    async findOne(id: number):Promise<CourseRegistration> {
        const courseRegistration = await this.courseRegistrationRepository.findOne({ where: { course_registration_id: id }});
        this.handleNotFound(courseRegistration, id)
        return courseRegistration;
    }

    async update(id: number, updateCourseRegistrationDto: UpdateCourseRegistrationDto) {
        const courseRegistration = await this.courseRegistrationRepository.findOne({ 
            where: { course_registration_id: id }
        });
        this.handleNotFound(courseRegistration, id)

        Object.assign(courseRegistration, updateCourseRegistrationDto);
        return await this.courseRegistrationRepository.save(courseRegistration);
    }

    async remove(id: number): Promise<void> {
        const courseRegistration = await this.courseRegistrationRepository.findOne({ where: { course_registration_id: id }});
        this.handleNotFound(courseRegistration, id)
        await this.courseRegistrationRepository.delete(id);
    }

    // 예외 처리
    private handleNotFound(courseRegistration: CourseRegistration, id: number): void {
        if (!courseRegistration) {
            throw new NotFoundException(`Registration with ID ${id} not found`);
        }
    }
}
