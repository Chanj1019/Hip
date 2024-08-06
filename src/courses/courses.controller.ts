
import {Controller,Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus, ParseIntPipe} from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-courses.dto';
import { Course } from './course.entity';


@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Post('register')
    async create(@Body() createCourseDto: CreateCourseDto): Promise<{ message: string; course: Course }> {
        const course = await this.coursesService.create(createCourseDto);
        return { message: '강의가 생성되었습니다.', course  };
    }

    @Get()
    async findAll(): Promise<{ message: string; courses: Course[] }> {
        const courses = await this.coursesService.findAll();
        return { message: '모든 강의 조회를 완료했습니다.', courses };
    }

    @Get(':courseid')
    async findOne(@Param('courseid') courseId: number): Promise<{ message: string; course: Course }> {
        const course = await this.coursesService.findOne(courseId);
        if (!course) {
            throw new HttpException('강의를 찾을 수 없습니다.', HttpStatus.NOT_FOUND);
        }
        return { message: '강의 조회를 완료했습니다.', course };
    }

    @Delete(':courseid')
    async remove(@Param('courseid') courseId: number): Promise<{ message: string }> {
        await this.coursesService.remove(courseId);
        return { message: '강의가 삭제되었습니다.' };
    }

    @Put(':courseId')
    async update(
      @Param('courseId', ParseIntPipe) courseId: number,
      @Body() updateCourseDto: CreateCourseDto
    ): Promise<{ message: string }> {
      await this.coursesService.update(courseId, updateCourseDto);
      return { message: '강의가 성공적으로 업데이트되었습니다.' };
    }

}