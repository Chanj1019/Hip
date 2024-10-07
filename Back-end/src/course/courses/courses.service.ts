import { Injectable, NotFoundException, Logger, HttpException, HttpStatus, ConflictException } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRegistration } from '../course_registration/entities/course_registration.entity';
import { Registration } from '../../enums/role.enum';

@Injectable()
export class CoursesService {
    private readonly logger = new Logger(CoursesService.name);

    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
        @InjectRepository(CourseRegistration)
        private readonly courseRegistrationRepository: Repository<CourseRegistration>,
    ) {}

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
        const existCourse = await this.coursesRepository.findOne({
            where: { course_title: createCourseDto.course_title },
        });

        if (existCourse) {
            throw new HttpException('강의 제목이 이미 존재합니다.', HttpStatus.BAD_REQUEST);
        }
  
        const course = this.coursesRepository.create(createCourseDto);
        await this.coursesRepository.save(course);
        this.logger.log(`Course created: ${course.course_title}`);
        return course;
    }

    async findAll(): Promise<Course[]> {
        return this.coursesRepository.find();
    }

    async findOne(id: string): Promise<Course> {
        const course = await this.coursesRepository.findOne(
            { where: { course_title: id },
            relations: ['docName','uCats'] 
        });
        if (!course) {
            throw new NotFoundException('Course not found'); // 예외 처리 추가
        }
        return course;
    }

    async isApprovedInstructor(loginedUserId: number, courseId: number): Promise<boolean> {
        const registration = await this.courseRegistrationRepository.findOne({
            where: {
                user: { user_id: loginedUserId }, // 현재 로그인한 사용자 ID
                course: { course_id: courseId }, // 현재 프로젝트 ID
                course_registration_status: Registration.APPROVED, // 승인된 상태 확인
            },
        });
        return !!registration;
    } 

    async update(id: string, updateCourseDto: UpdateCourseDto, loginedUser: number): Promise<Course> {
        // 데이터베이스에서 해당 ID의 강의 조회
        const course = await this.coursesRepository.findOne(
            { where: { course_title: id } 
        });

        if (!course) {
            this.logger.warn(`Course with ID ${id} not found`);
            throw new NotFoundException(`Course with ID ${id} not found`);
        }

        // 해당 프로젝트에 대한 승인된 학생인지
        const approvedInstructor = await this.isApprovedInstructor(loginedUser, id);

        if (!approvedInstructor) {
            throw new ConflictException(`수정 권한이 없습니다.`);
        }
  
        // UpdateCourseDto에 포함된 필드만 업데이트
        if (updateCourseDto.course_title) {
            course.course_title = updateCourseDto.course_title;
        }
        if (updateCourseDto.description) {
            course.description = updateCourseDto.description;
        }
        if (updateCourseDto.instructor_name) {
            course.instructor_name = updateCourseDto.instructor_name;
        }
        if (updateCourseDto.course_notice) {
            course.course_notice = updateCourseDto.course_notice;
        }
  
        // 업데이트된 엔티티를 저장
        await this.coursesRepository.save(course);
        this.logger.log(`Course updated: ${course.course_title}`);
        return course;
    }
  
    async remove(id: string): Promise<void> {
        const course = await this.coursesRepository.findOne(
            { where: { course_title: id },
            relations: ['docName'] 
        });
        if(course){
            await this.coursesRepository.remove(course);
        }
        // if (course.affected === 0) {
        //     this.logger.warn(`Attempt to delete non-existent course with ID ${id}`);
        //     throw new NotFoundException(`Course with ID ${id} not found for deletion`);
        // }
        // this.logger.log(`Course with ID ${id} deleted`);
    }
}