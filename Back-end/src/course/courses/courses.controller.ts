import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { OwnershipGuard } from '../../auth/ownership.guard';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Post('register')
    @Roles('amdin','instructor')
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
    @Roles('admin')
    async findAll() {
        const data = await this.coursesService.findAll();
        return {
            message: "전체 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get(':id')
    async findOne(
      @Param('id') id: number
    ) {
        const data = await this.coursesService.findOne(id);
        return {
            message: "특정 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':id')
    @Roles('instructor','admin')
    @UseGuards(OwnershipGuard)
    async update(
      @Param('id') id: string, @Body() updateCourseDto: any
    ) {
        const data = await this.coursesService.update(id, updateCourseDto);
        return {
            message: "강의 수정에 성공하셨습니다",
            data: data
        };
    }

    @Delete(':type/:id')
    @Roles('instructor','admin')
    @UseGuards(OwnershipGuard)
    async remove(
      @Param('id') id: number
    ) {
        const data = await this.coursesService.remove(id);
        return {
            message: "강의 삭제에 성공하셨습니다",
            data: data
        };
    }
}
