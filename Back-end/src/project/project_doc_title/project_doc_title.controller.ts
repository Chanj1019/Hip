import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { CreateProjectDocTitleDto } from './dto/create-project_doc_title.dto';
import { UpdateProjectDocTitleDto } from './dto/update-project_doc_title.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApprovedStudentGuard } from '../../auth/project.approved.guard';
import { ProjectDocTitleResponseDto } from './dto/project_doc_title-response.dto';
import { ApiResponse } from 'src/common/api-response.dto';
import { ProjectDocTitleService } from './project_doc_title.service';
import { DocTitleWithProjectDocResponseDto } from './dto/doc_title-with-project_doc-response.dto';

@UseGuards(JwtAuthGuard, RolesGuard, ApprovedStudentGuard)
@Controller('projects/:projectId/projectDocs')
export class ProjectDocTitleController {
    constructor(private readonly projectDocTitleService: ProjectDocTitleService) {}

    @Post('register')
    @Roles('instructor','student','admin')
    async create(
        @Param('projectId') projectId: number,
        @Body() createProjectDocDto: CreateProjectDocTitleDto,
    ): Promise<ApiResponse<ProjectDocTitleResponseDto>> {
        const data = await this.projectDocTitleService.create(projectId, createProjectDocDto);
        const responseData = new ProjectDocTitleResponseDto(data);
        return new ApiResponse<ProjectDocTitleResponseDto>(200, '성공적으로 등록되었습니다.', responseData);
    }

    @Get()
    async findAll(
        @Param('projectId') projectId: number
    ): Promise<ApiResponse<ProjectDocTitleResponseDto[]>> {
        const data = await this.projectDocTitleService.findAll(projectId);
        const responseData = data.map(doc => new ProjectDocTitleResponseDto(doc));
        return new ApiResponse<ProjectDocTitleResponseDto[]>(200, '전체 조회를 완료했습니다.', responseData );
    }

    @Get(':id/read')
    async findOne(
        @Param('id') id: number, 
        @Param('projectId') projectId: number
    ): Promise<ApiResponse<ProjectDocTitleResponseDto>> {
        const data = await this.projectDocTitleService.findOne(id, projectId);
        const responseData = new ProjectDocTitleResponseDto(data);
        return new ApiResponse<ProjectDocTitleResponseDto>(200, '성공적으로 조회하였습니다.', responseData); 
    }
    
    @Get('root')
    async findRootDocTitles(
        @Param('projectId') projectId: number
    ): Promise<{ message: string; data: DocTitleWithProjectDocResponseDto[] }> {
        const docTitles = await this.projectDocTitleService.findRootDocTitle(projectId);
        return {
            message: "최상위 디렉토리 조회에 성공하셨습니다",
            data: docTitles.map(docTitle => new DocTitleWithProjectDocResponseDto(docTitle))
        };
    }

    @Put(':id/update')
    @Roles('instructor','student','admin')
    async update(
        @Param('id') id: number, 
        @Body() updateProjectDocDto: UpdateProjectDocTitleDto,
        @Param('projectId') projectId: number
    ): Promise<ApiResponse<ProjectDocTitleResponseDto>> {
        const data = await this.projectDocTitleService.update(id, updateProjectDocDto, projectId);
        const responseData = new ProjectDocTitleResponseDto(data);
        return new ApiResponse<ProjectDocTitleResponseDto>(200, '성공적으로 수정되었습니다.', responseData);
    }

    @Delete(':id/delete')
    @Roles('instructor','student','admin')
    async remove(
        @Param('id') id: number,
        @Param('projectId') projectId: number
    ): Promise<{ message: string }> {
        await this.projectDocTitleService.remove(id, projectId);
        return { message: '성공적으로 삭제되었습니다.' };
    }
}
