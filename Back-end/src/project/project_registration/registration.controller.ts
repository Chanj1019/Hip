import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ProjectRegistrationService } from './registration.service';
import { CreateProjectRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('projects/:projectTopic/projectRegistrations')
export class ProjectRegistrationController {
    constructor(private readonly registrationService: ProjectRegistrationService) {}

    @Post('register')
    @Roles('student')
    async create(@Body() createRegistrationDto: CreateProjectRegistrationDto) {
        const data = await this.registrationService.create(createRegistrationDto);
        return {
            message: "프로젝트 신청이 완료되었습니다.",
            data: data,
        };
    }

    @Get()
    @Roles('instructor', 'admin')
    async findAll() {
        const data = await this.registrationService.findAll();
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

    @Delete(':id')
    @Roles('student')
    async remove(@Param('id') id: number) {
        await this.registrationService.remove(id);
        return {
            message: "프로젝트 신청이 취소되었습니다.",
        };
    }
}
