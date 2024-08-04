// courses.service.ts
import { Injectable, HttpException, HttpStatus  } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Course } from './course.entity';
import { CreateCourseDto } from './dto/create-courses.dto';

@Injectable()
export class CoursesService {
    constructor(
        @InjectRepository(Course)
        private coursesRepository: Repository<Course>
    ) {}

    async create(createCourseDto: CreateCourseDto): Promise<Course> {
        const course = this.coursesRepository.create(createCourseDto);
        return await this.coursesRepository.save(course);
    }

    async findAll(): Promise<Course[]> {
        return await this.coursesRepository.find();
    }

    async findOne(courseId: number): Promise<Course> {
        return await this.coursesRepository.findOneBy({ course_id: courseId });
    }

    async remove(courseId: number): Promise<void> {
        await this.coursesRepository.delete(courseId);
    }

    async update(courseId: number, description: string, instructor_id: number): Promise<Course> {
        const course = await this.coursesRepository.findOneBy({ course_id: courseId });
        
        if (!course) {
            throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
        }
        if (!course) {
            throw new HttpException('Course not found', HttpStatus.NOT_FOUND);
        }
    
        // 유효성 검사 (필요에 따라 추가)
        if (description) {
            course.description = description;
        }
        if (instructor_id) {
            course.instructor_id = instructor_id;
        }
        if (course_title) {
            course.course_title = course_title;
        }
        Object.assign(course, createCourseDto);
        return await this.coursesRepository.save(course);
    }
}
