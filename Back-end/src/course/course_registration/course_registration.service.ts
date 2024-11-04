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

    // 강의 ID가 유효한지 확인
    async validateCourseId(courseId: number): Promise<void> {
        const course = await this.coursesRepository.findOne({ where: { course_id: courseId } });
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
    }

    // 해당 강의에 이미 수강신청이 되어 있는지 확인
    async isEnrolled(courseId: number, userId: number): Promise<boolean> {
        const existingEnrollment = await this.courseRegistrationRepository.findOne({
            where: {
                course: { course_id: courseId }, // 프로젝트 ID로 필터링
                user: { user_id: userId }, // 사용자 ID로 필터링
            },
        });

        return !!existingEnrollment; // 이미 존재하면 true, 없으면 false
    }

    // 수강 신청 하기
    async create(createCourseRegistrationDto: CreateRequestCourseRegistrationDto, courseId: number, loginedUser: number) {
        await this.validateCourseId(courseId);
        // 이미 해당 강의에 참가 신청이 되어 있을 때
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

    // 전체 수강 신청 조회
    // async findAll(courseId: number): Promise<CourseRegistration[]> {
    //     await this.validateCourseId(courseId);
    //     return this.courseRegistrationRepository.find();
    // }

    // <admin> 전체 수강 신청 정보 조회
    async findAllCoursesWithRegistrationsForAdmin(course_id: number): Promise<CourseRegistration[]> {
        await this.validateCourseId(course_id)
        const registrations = await this.courseRegistrationRepository.find({
            relations: ['user', 'course'], // 사용자와 강의 정보 모두 로드
            where: { course: { generation: '3기' } },
        });
    
        if (registrations.length === 0) {
            throw new NotFoundException(`수강 신청 정보가 없습니다.`);
        }
    
        return registrations;
    }

    // <student,instructor> 개인 수강 신청 상태 조회
    async findOne(id: number, courseId: number):Promise<CourseRegistration> {
        await this.validateCourseId(courseId);
        const courseRegistration = await this.courseRegistrationRepository.findOne({ where: { course_registration_id: id }});
        if(!courseRegistration) {
            throw new NotFoundException(`Registration with ID ${id} not found`);
        }
        return courseRegistration;
    }

    // 수강 신청 수정
    async update(id: number, updateRequestCourseRegistrationDto: UpdateRequestCourseRegistrationDto, courseId: number) {
        const courseRegistration = await this.findOne(id, courseId);

        Object.assign(courseRegistration, updateRequestCourseRegistrationDto);
        return await this.courseRegistrationRepository.save(courseRegistration);
    }

    // 수강 신청 제거
    async remove(id: number, courseId: number): Promise<void> {
        await this.findOne(id, courseId);
        await this.courseRegistrationRepository.delete(id);
    }
}
