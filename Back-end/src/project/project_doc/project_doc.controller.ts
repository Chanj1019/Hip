import { Controller, Get, Post, Body, Patch, Param, Delete, UploadedFile, UseInterceptors } from '@nestjs/common';
import { ProjectDocService } from './project_doc.service';
import { CreateProjectDocDto } from './dto/create-project_doc.dto';
import { UpdateProjectDocDto } from './dto/update-project_doc.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('projects/:projectId/:projectDocTitleId/project-doc')
export class ProjectDocController {
  constructor(private readonly projectDocService: ProjectDocService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))  // 'file' 필드에서 파일을 업로드 받음
  create(
    @Param('projectId') projectId: number,
    @Param('projectDocTitleId') projectDocTitleId: number,
    @Body() createProjectDocDto: CreateProjectDocDto,
    @UploadedFile() file: Express.Multer.File,// 업로드된 파일을 가져옴
  ) {// 업로드된 파일을 가져옴
    return this.projectDocService.create(projectId, projectDocTitleId, createProjectDocDto, file);
  }

  @Get()
  findAll() {
    return this.projectDocService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.projectDocService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDocDto: UpdateProjectDocDto) {
    return this.projectDocService.update(+id, updateProjectDocDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.projectDocService.remove(+id);
  }
}
