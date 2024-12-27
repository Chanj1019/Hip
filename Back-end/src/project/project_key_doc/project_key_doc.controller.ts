import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ProjectKeyDocService } from './project_key_doc.service';
import { CreateProjectKeyDocDto } from './dto/create-project_key_doc.dto';
import { UpdateProjectKeyDocDto } from './dto/update-project_key_doc.dto';
import { ProjectKeyDocResponseDto } from './dto/project_key_doc-response.dto';
import { ApiResponse } from 'src/common/api-response.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/auth/roles.guard';
import { ApprovedStudentGuard } from 'src/auth/project.approved.guard';
import { Roles } from 'src/auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard, ApprovedStudentGuard)
@Controller('projects/:project/project-key-doc')
export class ProjectKeyDocController {
  constructor(private readonly projectKeyDocService: ProjectKeyDocService) {}

  @Post('register')
  @Roles('instructor','student','admin')
  async create(
    @Body() createProjectKeyDocDto: CreateProjectKeyDocDto
  ): Promise<ApiResponse<ProjectKeyDocResponseDto>> {
    const data = await this.projectKeyDocService.create(createProjectKeyDocDto);
    return new ApiResponse<ProjectKeyDocResponseDto>(200, "생성", data);
  }

  @Get()
  @Roles('instructor','student','admin')
  async findAll(

  ): Promise<ApiResponse<ProjectKeyDocResponseDto[]>> {
    const data = await this.projectKeyDocService.findAll();
    return new ApiResponse<ProjectKeyDocResponseDto[]>(200, "전체 조회", data);
  }

  @Get(':id')
  @Roles('instructor','student','admin')
  async findOne(
    @Param('id') id: number
  ): Promise<ApiResponse<ProjectKeyDocResponseDto>> {
    const data = await this.projectKeyDocService.findOne(id);
    return new ApiResponse<ProjectKeyDocResponseDto>(200, "조회", data);
  }

  @Patch(':id')
  @Roles('instructor','student','admin')
  async update(
    @Param('id') id: number, 
    @Body() updateProjectKeyDocDto: UpdateProjectKeyDocDto
  ): Promise<ApiResponse<ProjectKeyDocResponseDto>> {
    const data = await this.projectKeyDocService.update(id, updateProjectKeyDocDto);
    return new ApiResponse<ProjectKeyDocResponseDto>(200, "수정", data);
  }

  @Delete(':id')
  @Roles('instructor','student','admin')
  async remove(
    @Param('id') id: number
  ): Promise<{message: string}> {
    const data = await this.projectKeyDocService.remove(id);
    return {message: '삭제 성공'};
  }
}
