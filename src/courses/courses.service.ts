// courses.service.ts
import { Injectable, HttpException, HttpStatus, NotFoundException  } from '@nestjs/common';
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

    async update(courseId: number, updateCourseDto: CreateCourseDto): Promise<Course> {
      const course = await this.coursesRepository.findOneBy({ course_id: courseId });
      
      if (!course) {
        throw new NotFoundException('강의를 찾을 수 없습니다.');
      }

      Object.assign(course, updateCourseDto);
      return await this.coursesRepository.save(course);
    }
    
}
