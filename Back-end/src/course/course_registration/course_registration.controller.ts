import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request } from '@nestjs/common';
import { CourseRegistrationService } from './course_registration.service';
import { CreateRequestCourseRegistrationDto } from './dto/create-request-course_registration.dto';
import { UpdateRequestCourseRegistrationDto } from './dto/update-request-course_registration.dto';
import { CourseRegistationResponseDto } from './dto/courseregistation-response.dto.ts';
import { CourseRegistration } from './entities/course_registration.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('courses/:courseId/courseRegistration')
export class CourseRegistrationController {
    constructor(private readonly courseRegistrationService: CourseRegistrationService) {}

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Post('register')
    @Roles('instructor', 'student','admin')
    // 수강 신청
    async create(
        @Body() createRequestCourseRegistrationDto: CreateRequestCourseRegistrationDto,
        @Param('courseId') course_id: number,
        @Request() req
    ): Promise<{ message: string }> {
        // 로그인된 user 저장
        const loginedUser = req.user.user_id;

        // 수강 신청 생성
        await this.courseRegistrationService.create(createRequestCourseRegistrationDto, course_id, loginedUser);

        return { 
            message: "수강 신청이 완료되었습니다."
        };
    }

    // <admin> 전체 수강 신청 정보 조회
    @Get()
    @Roles('admin')
    async findAllForAdmin(
        @Param('courseId') course_id: number,
    ): Promise<{ message: string, data: CourseRegistationResponseDto[] }> {
        const foundRegistrations = await this.courseRegistrationService.findAllCoursesWithRegistrationsForAdmin(course_id);
        const responseDtos = foundRegistrations.map(responseDto => new CourseRegistationResponseDto(responseDto));

        return {
            message: "수강 신청 정보가 조회되었습니다.",
            data: responseDtos,
        };
    }

    @Get(':id')
    @Roles('student','instructor')
    async findOne(
        @Param('id') id: number,
        @Param('courseId') courseId: number
    ): Promise<{ message: string, data: CourseRegistration }> {
        const data = await this.courseRegistrationService.findOne(id, courseId);

        return {
            message: "수강 신청 정보가 조회되었습니다.",
            data: data
        };
    }

    @Get(':id/approvedcourse')
    @Roles('student','instructor')
    async findOneApprovedRegistration(
        @Param('id') id: number,
        @Param('courseId') courseId: number
    ): Promise<{ message: string, data: CourseRegistration }> {
        const data = await this.courseRegistrationService.findOneApprovedRegistration(id, courseId);
        console.log(data);
        return {
            message: "수강 신청 정보가 조회되었습니다.",
            data: data
        };
    }


    // 수강 신청 수정
    @Patch(':id/update')
    @Roles('admin')
    async update(
        @Param('course') courseId: number,
        @Param('id') id: number, 
        @Body() updateRequestCourseRegistrationDto: UpdateRequestCourseRegistrationDto
    ) {
        const data = this.courseRegistrationService.update(id, updateRequestCourseRegistrationDto, courseId);
        return {
            message: "수강 신청이 정보가 업데이트되었습니다.",
            data: data,
        }
    }
    
    // 수강 신청 삭제
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

    // <admin> 전체 수강 신청 정보 조회 -> 11/06, 쿼리 빌더로 course와 함께 JSON으로 보냄
    // @Get()
    // @Roles('admin')
    // async findAllForAdmin(
    //     @Param('courseId') course_id: number,
    // ): Promise<{ message: string, data: GetAdminResponseCourseRegistrationDto[] }> {
    //     const foundRegistrations = await this.courseRegistrationService.findAllCoursesWithRegistrationsForAdmin(course_id);
    //     const responseDtos = foundRegistrations.map(responseDto => new GetAdminResponseCourseRegistrationDto(responseDto));

    //     return {
    //         message: "수강 신청 정보가 조회되었습니다.",
    //         data: responseDtos,
    //     };
    // } 

    // <student,instructor> 개인 수강 신청 상태 조회 -> 11/06, 쿼리 빌더로 course와 함께 JSON으로 보냄
    // @Get(':id')
    // @Roles('student','instructor')
    // async findOne(
    //     @Param('id') id: number,
    //     @Param('courseId') courseId: number
    // ): Promise<{ message: string, data: CourseRegistration }> {
    //     const generation = '3기';
    //     const data = await this.courseRegistrationService.findOne(id, courseId);

    //     return {
    //         message: "수강 신청 정보가 조회되었습니다.",
    //         data: data
    //     };
    // }

}
export { CourseRegistationResponseDto };

