import { Controller, Get, Post, Patch, Delete, Param, Body, UseGuards, Request } from '@nestjs/common';
import { ProjectRegistrationService } from './registration.service';
import { CreateProjectRegistrationDto } from './dto/create-registration.dto';
import { UpdateProjectRegistrationDto } from './dto/update-registration.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects/:project/projectRegistration')
export class ProjectRegistrationController {
    constructor(private readonly projectRegistrationService: ProjectRegistrationService) {}

    @Post('register')
    @Roles('student')
    async create(@Body() createProjectRegistrationDto: CreateProjectRegistrationDto, @Request() req, @Param('project') project_id: number) {
        const loginedUser = req.user.user_id;
        const projectId = project_id;

        const data = await this.projectRegistrationService.create(createProjectRegistrationDto, projectId, loginedUser);
        return {
            message: "프로젝트 신청이 완료되었습니다.",
            data: data,
        };
    }

    @Get()
    @Roles('instructor', 'admin')
    async findAll(
        @Param('project') projectId: number,
    ) {
        const data = await this.projectRegistrationService.findAll(projectId);
        return {
            message: "프로젝트 신청자가 조회되었습니다.",
            data: data,
        };
    }

    // @Get('students')
    // @Roles('instructor', 'admin')
    // async findStudents(@Param('projectTopic') projectTopic: string) {
    //     const data = await this.registrationService.findStudentsForProjectRegistration(projectTopic);
    //     return {
    //         message: "프로젝트에 신청한 학생들이 조회되었습니다.",
    //         data: data,
    //     };
    // }

    @Patch(':id')
    @Roles('instructor','admin')
    async update(
        @Param('id') id: number, 
        @Body() updateProjectRegistrationDto: UpdateProjectRegistrationDto, 
        @Param('project') projectId: number) {
        const updatedData = await this.projectRegistrationService.update(id, updateProjectRegistrationDto, projectId);
        return {
            message: "프로젝트 신청 정보가 업데이트되었습니다.",
            data: updatedData,
        };
    }

    // 프로젝트 참가 신청을 삭제
    @Delete(':id')
    @Roles('student')
    async remove(@Param('id') id: number, @Param('project') projectId: number) {
        await this.projectRegistrationService.remove(id, projectId);
        return {
            message: "프로젝트 신청이 취소되었습니다.",
        };
    }
}
