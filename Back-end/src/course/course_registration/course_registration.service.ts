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
    async create(createCourseRegistrationDto: CreateCourseRegistrationDto) {
        // 이미 해당 강의에 수강 신청이 되어 있을 때
        const courseId = createCourseRegistrationDto.courseId;
        const existingCourse = await this.coursesRepository.findOne({ 
            where: { course_id: courseId } 
        });
        if(!existingCourse){
            throw new ConflictException('강의가 존재하지 않습니다.');
        }

        const userId = createCourseRegistrationDto.userId;
        const existingUser = await this.userRepository.findOne({
             where: { user_id: userId }
            });
        if(!existingUser){
            throw new ConflictException('사용자가 일치하지 않습니다.');
        }

        const existingCourseRegistration = await this.courseRegistrationRepository.findOne({
            where: {
                user: existingUser,
                course: existingCourse,
            },
        });

        if(existingCourseRegistration){
            throw new ConflictException('이미 신청된 강의입니다.');
        }

        // 처음 참가 신청
        const courseRegistration = this.courseRegistrationRepository.create(createCourseRegistrationDto);
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
