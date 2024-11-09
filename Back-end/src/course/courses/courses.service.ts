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
import { CourseWithCourseRegistrationResponseDto } from './dto/course-with-registration';
import { UserResponseDto } from 'src/user/dto/user-response.dto';

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

    async findCourseWithCourseRegistration(userId: number): Promise<CourseWithCourseRegistrationResponseDto[]> {
        const user = await this.userRepository.findOne({
            where: { user_id: userId },
            relations: ['course_registration']
        });

        if (!user) {
            throw new NotFoundException(`User with ID ${userId} not found`);
        }

        return user.course.map(course => new CourseWithCourseRegistrationResponseDto(course));
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
        // 데이터베이스에서 해당 ID의 강의 조회
        const course = await this.coursesRepository.findOne(
            { where: { course_id: id } 
        });

        if (!course) {
            this.logger.warn(`클래스를 찾지 못했습니다.`);
            throw new NotFoundException(`클래스를 찾지 못했습니다.`);
        }

        // 해당 프로젝트에 대한 승인된 학생인지
        // const approvedInstructor = await this.isApprovedInstructor(loginedUser, id);

        // if (!approvedInstructor) {
        //     throw new ConflictException(`수정 권한이 없습니다.`);
        // }
  
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