import { Injectable, NotFoundException, Logger, HttpException, HttpStatus, BadRequestException } from '@nestjs/common';
import { Course } from './entities/course.entity';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class CoursesService {
    private readonly logger = new Logger(CoursesService.name);

    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>,
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

    async update(id: number, updateCourseDto: UpdateCourseDto): Promise<Course> {
        // 데이터베이스에서 해당 ID의 강의 조회
        const course = await this.coursesRepository.findOne(
            { where: { course_id: id } 
        });

        if (!course) {
            this.logger.warn(`클래스를 찾지 못했습니다.`);
            throw new NotFoundException(`클래스를 찾지 못했습니다.`);
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
  
    async remove(id: number): Promise<void> {
        const course = await this.coursesRepository.findOne(
            { where: { course_id: id },
            relations: ['docName'] 
        });
    
        if (!course) {
            throw new NotFoundException(`클래스를 찾지 못했습니다.`);
        }
    
        await this.coursesRepository.remove(course);
        this.logger.log(`클래스가 삭제되었습니다.`);
    }
    
    
}