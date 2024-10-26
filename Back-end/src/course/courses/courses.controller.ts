import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApprovedInstructorGuard } from '../../auth/course.approved.guard';
import { OwnershipGuard } from '../../auth/ownership.guard';
// import { CreateCourseDto } from './dto/create-course.dto';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Post('register')
    @Roles('admin')
    async create(
      @Body() CreateCourseDto: any,
    ) {
        const data = await this.coursesService.create(CreateCourseDto);
        return {
            message: "생성에 성공하셨습니다",
            data: data
        };
    }

    @Get()
    @Roles('student','instructor','admin')
    async findAll() {
        const data = await this.coursesService.findAll();
        return {
            message: "전체 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get(':id/read')
    async findOne(
      @Param('id') id: number
    ) {
        const data = await this.coursesService.findOne(id);
        return {
            message: "특정 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':type/:id/update')
    @Roles('admin','instructor')
    @UseGuards(OwnershipGuard, ApprovedInstructorGuard)
    async update(
      @Param('id') id: number, 
      @Body() updateCourseDto: any,
      @Request() req
    ) {
        const loginedUser = req.user.user_id;
        const data = await this.coursesService.update(id, updateCourseDto, loginedUser);
        return {
            message: "강의 수정에 성공하셨습니다",
            data: data
        };
    }

    @Delete(':type/:id/delete')
    @UseGuards(OwnershipGuard)
    @Roles('admin')
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
