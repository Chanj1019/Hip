import { Controller, Get, Post, Body, Param, Delete, ParseIntPipe, UseGuards, Patch, Request } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project } from './entities/project.entity';
import { RolesGuard } from '../../auth/roles.guard'; // 역할 기반 가드 임포트
import { Roles } from '../../auth/roles.decorator'; // 역할 데코레이터 임포트
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { ApprovedStudentGuard } from '../../auth/project.approved.guard';
import { ProjectResponseDto } from './dto/project-response.dto';
import { ApiResponse } from 'src/common/api-response.dto';
@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('projects')
export class ProjectsController {
    constructor(private readonly projectsService: ProjectsService) {}
 
    @Post('register')
    @Roles('admin','instructor')
    async create(
        @Body() createProjectDto: CreateProjectDto
    ): Promise<ApiResponse<ProjectResponseDto>> {
        const data = await this.projectsService.create(createProjectDto);
        return new ApiResponse<ProjectResponseDto>(200, "프로젝트를 생성했습니다", data);
        // return {
        //     statusCode: 200,
        //     message: "프로젝트를 생성했습니다",
        //     data: data,
        // };
    }

    @Get()
    @Roles('admin','instructor')
    async findAll(

    ): Promise<ApiResponse<ProjectResponseDto[]>> {
        const data =  await this.projectsService.findAll();
        return new ApiResponse<ProjectResponseDto[]>(200, "프로젝트 전체 조회", data);
    }

    @Get(':id')
    @Roles('student','admin','instructor')
    async findOne(
        @Param('id', ParseIntPipe) id: number
    ): Promise<ApiResponse<ProjectResponseDto>> {
        const data = await this.projectsService.findOne(id);
        return new ApiResponse<ProjectResponseDto>(200, "프로젝트 조회", data);
    }

    @Patch(':id/update')
    @Roles('instructor','admin','student')
    @UseGuards(ApprovedStudentGuard)
    async update(
        @Param('id',ParseIntPipe) id: number, 
        @Body() updateProjectDto: UpdateProjectDto, 
        @Request() req
    ): Promise<ApiResponse<ProjectResponseDto>> {
        const loginedUser = req.user.user_id;
        const updatedData = await this.projectsService.update(id, updateProjectDto, loginedUser);
        return new ApiResponse<ProjectResponseDto>(200, "프로젝트가 수정되었습니다.", updatedData);
        // return {
        //     message: "프로젝트가 수정되었습니다.",
        //     data: updatedData,
        // };
    }

    @Delete(':id/delete')
    @Roles('admin', 'instructor')
    async remove(
        @Param('id', ParseIntPipe) id: number
    ): Promise<{ message: string; }> {
        await this.projectsService.remove(id);
        return {
            message: "프로젝트가 삭제되었습니다."
        };
    }

}
