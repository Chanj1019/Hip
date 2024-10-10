import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateRequestCourseRegistrationDto } from './dto/create-request-course_registration.dto';
import { UpdateRequestCourseRegistrationDto } from './dto/update-request-course_registration.dto';
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

    // 강의 ID가 유효한지 확인하는 함수
    async validateCourseId(courseId: number): Promise<void> {
        const course = await this.coursesRepository.findOne({ where: { course_id: courseId } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
    }

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

    async create(createCourseRegistrationDto: CreateRequestCourseRegistrationDto, courseId: number, loginedUser: number) {
        await this.validateCourseId(courseId);

        // 이미 해당 프로젝트에 참가 신청이 되어 있을 때
        const isAlreadyEnrolled = await this.isEnrolled(courseId, loginedUser);

        if(isAlreadyEnrolled){
            throw new ConflictException('신청된 강의입니다.');
        }

        // 처음 참가 신청
        const courseRegistration = this.courseRegistrationRepository.create(createCourseRegistrationDto);
        courseRegistration.user = await this.userRepository.findOneBy({ user_id: loginedUser });  // 특정 사용자와 연결된 정보
        courseRegistration.course = await this.coursesRepository.findOneBy({ course_id: courseId });  // 특정 프로젝트와 연결된 정보
        return await this.courseRegistrationRepository.save(courseRegistration);
    }

    async findAll(courseId: number): Promise<CourseRegistration[]> {
        await this.validateCourseId(courseId);
        return this.courseRegistrationRepository.find();
    }

    async findOne(id: number, courseId: number):Promise<CourseRegistration> {
        await this.validateCourseId(courseId);
        const courseRegistration = await this.courseRegistrationRepository.findOne({ where: { course_registration_id: id }});
        if(!courseRegistration) {
            throw new NotFoundException(`Registration with ID ${id} not found`);
        }
        return courseRegistration;
    }

    async update(id: number, updateCourseRegistrationDto: UpdateCourseRegistrationDto, courseId: number) {
        const courseRegistration = await this.findOne(id, courseId);

        Object.assign(courseRegistration, updateCourseRegistrationDto);
        return await this.courseRegistrationRepository.save(courseRegistration);
    }

    async remove(id: number, courseId: number): Promise<void> {
        await this.findOne(id, courseId);
        await this.courseRegistrationRepository.delete(id);
    }
}
