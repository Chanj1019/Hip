import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, Res, HttpStatus } from '@nestjs/common';
import { ProjectDocService } from './project_doc.service';
import { CreateProjectDocDto } from './dto/create-project_doc.dto';
import { UpdateProjectDocDto } from './dto/update-project_doc.dto';
import { Project_doc } from './entities/project_doc.entity';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('project-docs')
export class ProjectDocController {
  constructor(private readonly projectDocsService: ProjectDocService) {}

  @Get()
  async findAll(): Promise<{ doc: Project_doc[]; message: string }> {
    const doc = await this.projectDocsService.findAll();
    return { message: '전체 프로젝트 자료 조회를 완료했습니다.', doc };
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<{ doc: Project_doc; message: string }> {
    const doc = await this.projectDocsService.findOne(id);
    return { message: '프로젝트 자료 조회를 완료했습니다.', doc };
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('file'))  // 'file' 필드에서 파일을 업로드 받음
  async createProjectDoc(
    @Body() createProjectDocDto: CreateProjectDocDto,  // DTO 이름 수정
    @UploadedFile() file: Express.Multer.File,  // 업로드된 파일을 가져옴
  ): Promise<{ message: string; doc: any }> {  // 반환 타입 정의
    const doc = await this.projectDocsService.createProjectDoc(createProjectDocDto, file);
    return { message: '프로젝트 문서가 성공적으로 등록되었습니다.', doc };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateProjectDocDto: UpdateProjectDocDto,  // DTO 이름 수정
  ): Promise<{ doc: Project_doc; message: string }> {
    const doc = await this.projectDocsService.update(id, updateProjectDocDto);
    return { message: '프로젝트 문서가 성공적으로 업데이트 되었습니다.', doc };
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<{ message: string }> {
    await this.projectDocsService.remove(id);
    return { message: '성공적으로 삭제되었습니다.' };
  }
}
