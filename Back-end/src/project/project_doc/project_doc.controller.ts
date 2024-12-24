import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProjectDocService } from './project_doc.service';
import { CreateProjectDocDto } from './dto/create-project_doc.dto';
import { UpdateProjectDocDto } from './dto/update-project_doc.dto';
import { FileInterceptor } from '@nestjs/platform-express';
import { ProjectDocResponseDto } from './dto/project_doc-response.dto';
import { ApiResponse } from 'src/common/api-response.dto';

@Controller('projects/:projectId/:projectDocTitleId/project-doc')
export class ProjectDocController {
  constructor(private readonly projectDocService: ProjectDocService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Param('projectId') projectId: number,
    @Param('projectDocTitleId') projectDocTitleId: number,
    @Body() createProjectDocDto: CreateProjectDocDto,
    @UploadedFile() file: Express.Multer.File,// 업로드된 파일을 가져옴
  ): Promise<ApiResponse<ProjectDocResponseDto>> {// 업로드된 파일을 가져옴
    const data = await this.projectDocService.create(projectId, projectDocTitleId, createProjectDocDto, file);
    return new ApiResponse<ProjectDocResponseDto>(200, "생성", data);
  }

  @Get()
  async findAll(

  ): Promise<ApiResponse<ProjectDocResponseDto[]>> {
    const data = await this.projectDocService.findAll();
    return new ApiResponse<ProjectDocResponseDto[]>(200, "전체 조회", data);
  }

  @Get(':id')
  async findOne(
    @Param('id') id: number
  ): Promise<ApiResponse<ProjectDocResponseDto>> {
    const data = await this.projectDocService.findOne(id);
    return new ApiResponse<ProjectDocResponseDto>(200, "조회", data);
  }

  @Patch(':id')
  async update(
    @Param('id') id: number, 
    @Body() updateProjectDocDto: UpdateProjectDocDto
  ): Promise<ApiResponse<ProjectDocResponseDto>> {
    const data = await this.projectDocService.update(id, updateProjectDocDto);
    return new ApiResponse<ProjectDocResponseDto>(200, "수정", data);
  }

  @Delete(':id')
  async remove(
    @Param('id') id: number
  ): Promise<{ message: string }> {
    await this.projectDocService.remove(id);
    return { message: '삭제 성공' };
  }
}
