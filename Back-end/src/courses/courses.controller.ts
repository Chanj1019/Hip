import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { Course } from './entities/course.entity';

@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Post()
    async create(
      @Body() createCourseDto: any
    ) {
        const data = await this.coursesService.create(createCourseDto);
        return {
            message: "생성에 성공하셨습니다",
            data: data
        };
    }

    @Get()
    async findAll() {
        const data = await this.coursesService.findAll();
        return {
            message: "전체 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get(':id')
    async findOne(
      @Param('id') id: string
    ) {
        const data = await this.coursesService.findOne(id);
        return {
            message: "특정 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':id')
    async update(
      @Param('id') id: string, @Body() updateCourseDto: any
    ) {
        const data = await this.coursesService.update(id, updateCourseDto);
        return {
            message: "강의 수정에 성공하셨습니다",
            data: data
        };
    }

    @Delete(':id')
    async remove(
      @Param('id') id: string
    ) {
        const data = await this.coursesService.remove(id);
        return {
            message: "강의 삭제에 성공하셨습니다",
            data: data
        };
    }
}
