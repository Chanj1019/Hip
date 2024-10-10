import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CourseRegistrationService } from './course_registration.service';
import { CreateRequestCourseRegistrationDto } from './dto/create-request-course_registration.dto';
import { CreateResponseCourseRegistrationDto } from './dto/create-response-course_registration.dto';
import { UpdateRequestCourseRegistrationDto } from './dto/update-request-course_registration.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('courses/:course/courseRegistration')
export class CourseRegistrationController {
    constructor(private readonly courseRegistrationService: CourseRegistrationService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('register')
    @Roles('instructor', 'student')
  
    async create(
        @Body() createRequestCourseRegistrationDto: CreateRequestCourseRegistrationDto, 
        @Param('course') course_id: number,
        @Request() req
    ): Promise<{ message: string; data: UpdateRequestCourseRegistrationDto }> {
        // 로그인된 user 저장
        const loginedUser = req.user.user_id;

        // 수강 신청 생성
        const courseRegistration = await this.courseRegistrationService.create(createRequestCourseRegistrationDto, course_id, loginedUser);

        // 응답 DTO
        const responseDto = new CreateResponseCourseRegistrationDto(courseRegistration);

        return { 
            message: "수강 신청이 완료되었습니다.",
            data: responseDto,
        };
    }

    @Get()
    @Roles('admin')
    async findAll(@Param('course') courseId: number) {
        const data = this.courseRegistrationService.findAll(courseId);
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
        @Body() updateCourseRegistrationDto: UpdateCourseRegistrationDto,
        @Param('course') courseId: number
    ) {
        const data = this.courseRegistrationService.update(id, updateCourseRegistrationDto, courseId);
        return {
            message: "수강 신청이 정보가 업데이트되었습니다.",
            data: data,
        }
    }

    @Delete(':id/delete')
    @Roles('instructor', 'student')
    remove(
        @Param('id') id: number,
        @Param('course') courseId: number
    ) {
        const data = this.courseRegistrationService.remove(id, courseId);
        return {
            message: "수강 신청이 취소되었습니다.",
            data: data,
        }
    }
}
