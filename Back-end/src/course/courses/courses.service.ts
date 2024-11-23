import { Injectable, NotFoundException, Logger, HttpException, HttpStatus, BadRequestException, ConflictException, InternalServerErrorException } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseRegistration } from '../course_registration/entities/course_registration.entity';
import { Registration } from '../../enums/role.enum';
import { CourseWithVideoTopicResponseDto } from './dto/course-with-videotopic.dto';
import { User } from 'src/user/user.entity';
import { CourseResponseDto } from './dto/course-response.dto';
import { CourseWithDocNameAndCourseDocResponseDto } from './dto/course-with-docname-and-coursedoc.dto';
import { UserResponseDto } from 'src/user/dto/user-response.dto';
import { CourseWithCourseRegistrationResponseDto } from './dto/course-with-registration.dto';

@Injectable()
export class CoursesService {
    private readonly logger = new Logger(CoursesService.name);

    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
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
        this.logger.log(`강의가 생성되었습니다: ${course.course_title}`);
        return course;
    }

    async findMy(id: number): Promise<CourseResponseDto> {
        const course = await this.coursesRepository.findOne({
            where: { course_id: id },
            relations: ['user']  // 필요한 relations만 추가
        });

        if (!course) {
            throw new NotFoundException('강의를 찾지 못했습니다.');
        }

        return course;
    }
    
    // 관리자 조회
    async findAll(): Promise<Course[]> {
        return this.coursesRepository.find();
    }

    async findOne(id: number): Promise<Course> {
        const course = await this.coursesRepository.findOne(
            { where: { course_id: id },
            relations: ['docName','user'] 
        });
        if (!course) {
            throw new NotFoundException('클래스를 찾지 못했습니다.'); // 예외 처리 추가
        }
        return course;
    }

    // registration에서 강의에 대해 status를 조회하는 코드
    // async findStatus(id: number): Promise<Course> {
    //     const course = await this.coursesRepository.findOne(
    //         { where: { course_id: id },
    //         relations: ['course_registrations'] 
    //     });
    //     if (!course) {
    //         throw new NotFoundException('클래스를 찾지 못했습니다.'); // 예외 처리 추가
    //     }
    //     return course;
    // }

    async findCourseWithDocnameAndCourseDoc(courseId: number): Promise<CourseWithDocNameAndCourseDocResponseDto> {
        const course = await this.coursesRepository.findOne({
            where: { course_id: courseId },
            relations: ['docName', 'docName.courseDocs']
        });
     
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
     
        return {
            ...course,
            docName: course.docName.map(doc => ({
                topic_id: doc.topic_id,
                topic_title: doc.topic_title,
                pa_topic_id: doc.pa_topic_id,
                course_doc: doc.courseDocs
            }))
        };
     }

    async findCourseWithVideoTopic(courseId: number): Promise<CourseWithVideoTopicResponseDto> {
        const course = await this.coursesRepository.findOne({
            where: { course_id: courseId },
            relations: ['videoTopic'] // docName relation도 추가
        });
    
        if (!course) {
            throw new NotFoundException(`course with ID ${courseId} not found`);
        }
    
        // Course 엔티티를 DTO로 변환하여 반환
        return new CourseWithVideoTopicResponseDto(course);
    }

    // courses.service.ts 수정
    async findCourseWithCourseRegistration(courseId: number): Promise<CourseWithCourseRegistrationResponseDto> {
        try {
            // relations에 course 추가
            const course = await this.coursesRepository.findOne({
                where: { 
                    course_id: courseId 
                },
                relations: {
                    course_registrations: {
                        user: true,
                        course: true  // course 관계 추가
                    }
                }
            });

            if (!course) {
                throw new NotFoundException(`Course with ID ${courseId} not found`);
            }

            return new CourseWithCourseRegistrationResponseDto(course);
        } catch (error) {
            console.error('Error in findCourseWithCourseRegistration:', error);
            throw new InternalServerErrorException(
                'Failed to fetch course registration data',
                error.message
            );
        }
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

    async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
        // 1. 강의 존재 확인
        const course = await this.coursesRepository.findOne({
            where: { course_id: id }
        });
    
        if (!course) {
            this.logger.warn('클래스를 찾지 못했습니다.');
            throw new NotFoundException('클래스를 찾지 못했습니다.');
        }
    
        // 2. Object.assign을 사용하여 한번에 업데이트
        Object.assign(course, updateCourseDto);
    
        // 3. 저장 및 반환
        const updatedCourse = await this.coursesRepository.save(course);
        this.logger.log(`Course updated: ${updatedCourse.course_title}`);
        return updatedCourse;
    }
    
    async remove(courseId: number): Promise<void> {
        const course = await this.coursesRepository.findOne({
            where: { course_id: courseId },
            relations: {
                docName: true,
                videoTopic: true,
                course_registrations: true
            }
        });
    
        if (!course) {
            throw new NotFoundException(`Course with ID ${courseId} not found`);
        }
    
        try {
            await this.coursesRepository.remove(course);
            this.logger.log(`Course ID ${courseId} has been deleted successfully`);
        } catch (error) {
            this.logger.error(`Failed to delete course ${courseId}`, error.stack);
            throw new InternalServerErrorException('Failed to delete course');
        }
    }   
    
    
}