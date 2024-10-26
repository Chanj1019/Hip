import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CourseRegistrationService } from './course_registration.service';
import { CreateCourseRegistrationDto } from './dto/create-course_registration.dto';
import { UpdateCourseRegistrationDto } from './dto/update-course_registration.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('courses/:courseId/courseRegistration')
export class CourseRegistrationController {
    constructor(private readonly courseRegistrationService: CourseRegistrationService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('register')
    @Roles('instructor', 'student', 'admin')
  
    async create(
        @Body() createCourseRegistrationDto: CreateCourseRegistrationDto, 
        @Request() req, 
        @Param('courseId') course_id: number) {
        // 로그인된 user 저장
        const loginedUser = req.user.user_id;

        const data = await this.courseRegistrationService.create(createCourseRegistrationDto, loginedUser, course_id);

        return { 
            message: "수강 신청이 완료되었습니다.",
            data: data,
        };
    }

    @Get()
    @Roles('admin')
    async findAll() {
        const data = this.courseRegistrationService.findAll();
        return {
            message: "수강 신청 정보가 조회되었습니다.",
            data: data,
        }
    }

    // @Get(':id')
    // findOne(@Param('id') id: string) {
    //     return this.courseRegistrationService.findOne(+id);
    // }

    @Patch(':id/update')
    @Roles('admin')
    async update(
        @Param('id') id: number, 
        @Body() updateCourseRegistrationDto: UpdateCourseRegistrationDto
    ) {
        const data = this.courseRegistrationService.update(id, updateCourseRegistrationDto);
        return {
            message: "수강 신청이 정보가 업데이트되었습니다.",
            data: data,
        }
    }

    @Delete(':id/delete')
    @Roles('instructor', 'student')
    remove(
        @Param('id') id: number
    ) {
        const data = this.courseRegistrationService.remove(id);
        return {
            message: "수강 신청이 취소되었습니다.",
            data: data,
        }
    }
}
