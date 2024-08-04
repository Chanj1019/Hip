
import {Controller,Get, Post, Put, Delete, Param, Body, HttpException, HttpStatus,} from '@nestjs/common';
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

    @Put(':courseid')
    async update(
    @Param('courseid') courseId: string,
    @Body() body: { course_title: string; description: string; instructor_id: number; }):
    Promise<{ message: string }> {
      const id = parseInt(courseId, 10);
      if (isNaN(id)) {
          throw new HttpException('유효하지 않은 강의 ID입니다.', HttpStatus.BAD_REQUEST);
      }

      if (!body.course_title || !body.description || typeof body.instructor_id !== 'number') {
          throw new HttpException('모든 필드를 올바르게 입력해야 합니다.', HttpStatus.BAD_REQUEST);
      }

      const course = await this.coursesService.findOne(id);
      if (!course) {
          throw new HttpException('강의가 업데이트되지 못했습니다.', HttpStatus.NOT_FOUND);
      }

      const result = await this.coursesService.update(id, body.course_title, body.description, body.instructor_id);
      if (result) {
          return { message: '강의가 성공적으로 업데이트되었습니다.' };
      }

      throw new HttpException('강의 업데이트에 실패했습니다.', HttpStatus.INTERNAL_SERVER_ERROR);
    }

}