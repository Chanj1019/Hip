import { Controller, Post, Get, Patch, Delete, Param, Body, UseGuards, Request, Req } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApprovedInstructorGuard } from '../../auth/course.approved.guard';
import { OwnershipGuard } from '../../auth/ownership.guard';
import { CourseWithVideoTopicResponseDto } from './dto/course-with-videotopic.dto';
import { CourseResponseDto } from './dto/course-response.dto';
import { CourseWithDocNameAndCourseDocResponseDto } from './dto/course-with-docname-and-coursedoc.dto';
import { CreateCourseDto } from './dto/create-course.dto';
import { CourseWithCourseRegistrationResponseDto } from './dto/course-with-registration.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

// @UseGuards(JwtAuthGuard,RolesGuard)
@Controller('courses')
export class CoursesController {
    constructor(private readonly coursesService: CoursesService) {}

    // 관리자 강의 생성
    @Post('register')
    // @Roles('admin')
    async create(
      @Body() CreateCourseDto: CreateCourseDto,
    ): Promise<{ message: string; data: CourseResponseDto }> {
        const data = await this.coursesService.create(CreateCourseDto);
        return {
            message: "생성에 성공하셨습니다",
            data: data
        };
    }

    // 관리자 강의 전체 조회
    @Get('course-all')
    // @Roles('student','instructor','admin')
    async findAll(
    ): Promise<{ message: string; data: CourseResponseDto[] }> {
        const data = await this.coursesService.findAll();
        return {
            message: "전체 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    // status
    // @Get('/registration-status/:id')
    // // @Roles('student','instructor','admin')
    // async findStatus(
    //     @Param('id') id: number,
    // ): Promise<{ message: string; data: CourseResponseDto }> {
    //     const data = await this.coursesService.findStatus(id);
    //     return {
    //         message: "강의 조회에 성공하셨습니다",
    //         data: data
    //     };
    // }

    // 관리자 강의 삭제
    @Delete('delete/:id')
    // @UseGuards(OwnershipGuard)
    // @Roles('admin')
    async remove(
      @Param('id') courseId: number
    ): Promise<{ message: string; data: void }> {
        const data = await this.coursesService.remove(courseId);
        return {
            message: "강의 삭제에 성공하셨습니다",
            data: data
        };
    }

    // 관리자,강사 강의 수정
    @Patch('update/:id')
    // @Roles('admin','instructor')
    // @UseGuards(OwnershipGuard, ApprovedInstructorGuard)
    async update(
      @Param('id') id: number, 
      @Body() updateCourseDto: UpdateCourseDto,
    //   @Request() req
    ): Promise<{ message: string; data: CourseResponseDto }> {
        // const loginedUser = req.user.user_id;
        const data = await this.coursesService.update(id, updateCourseDto);
        return {
            message: "강의 수정에 성공하셨습니다",
            data: data
        };
    }

    // course만 조회
    @Get('only-course-my/:id')
    // @Roles('student', 'istructor', 'admin')
    async findMy(
        @Param('id') id: number
    ): Promise<{ message: string; data: CourseResponseDto }> {
        const data = await this.coursesService.findMy(id);
        return {
            message: "본인 강의 조회에 성공하셨습니다",
            data: data
        };
    }

    // 강사+학생: 본인이 진행하는 강의와 videotopic 조회
    @Get('course-videotopic/:id')
    // @Roles('student','instructor','admin')
    async findCourseWithVideoTopic(
        @Param('id') id: number
    ): Promise<{ message: string; data: CourseWithVideoTopicResponseDto }> {
        const data = await this.coursesService.findCourseWithVideoTopic(id);
        return {
            message: "강의와 비디오 토픽 조회에 성공하였습니다",
            data: data
        };
    }

    // 강사+학생: 본인이 진행하는 강의와 docname과 course doc 조회
    @Get('course-docname-coursedoc/:id')
    // @Roles('student','instructor','admin')
    async findCourseWithDocnameAndCourseDoc(
        @Param('id') id: number
    ): Promise<{ message: string; data: CourseWithDocNameAndCourseDocResponseDto }> {
        const data = await this.coursesService.findCourseWithDocnameAndCourseDoc(id);
        return {
            message: "강의와 문서 주제와 문서 조회에 성공하였습니다",
            data: data
        };
    }

    // 학생: 강의 수강신청
    @Get('course-courseregistration/:id')
    // @Roles('student','instructor','admin')
    async findCourseWithCourseRegistration(
        @Param('id') courseId: number
    ): Promise<{ message: string; data: CourseWithCourseRegistrationResponseDto }> {
        const data = await this.coursesService.findCourseWithCourseRegistration(courseId);
        return {
            message: "강의와 수강신청 정보 조회에 성공하였습니다",
            data: data
        };
    }

    // @Get(':id/read')
    // async findOne(
    //   @Param('id') id: number
    // ): Promise<{ message: string; data: DocNameResponseDto }> {
    //     const data = await this.coursesService.findOne(id);
    //     return {
    //         message: "특정 강의 조회에 성공하셨습니다",
    //         data: data
    //     };
    // }
}
