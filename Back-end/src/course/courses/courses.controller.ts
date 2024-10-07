import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
<<<<<<< HEAD
import { ApprovedInstructorGuard } from '../../auth/course.approved.guard';
=======
import { OwnershipGuard } from '../../auth/ownership.guard';
>>>>>>> b4d9d0579f1cedd2c324252a4c3a807a943c0755

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    @Post('register')
    @Roles('admin')
    async create(
      @Body() CreateCourseDto: any
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

<<<<<<< HEAD
    @Patch(':id')
    @Roles('instructor','admin')
    @UseGuards(ApprovedInstructorGuard)
    async update(
      @Param('id') id: string, @Body() updateCourseDto: any,
      @Request() req
=======
    @Patch(':type/:id/update')
    @Roles('admin')
    @UseGuards(OwnershipGuard)
    async update(
      @Param('id') id: number, 
      @Body() updateCourseDto: any
>>>>>>> b4d9d0579f1cedd2c324252a4c3a807a943c0755
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
