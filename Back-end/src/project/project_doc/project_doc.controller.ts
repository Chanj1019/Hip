import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { ProjectDocService } from './project_doc.service';
import { CreateProjectDocDto } from './dto/create-project_doc.dto';
import { UpdateProjectDocDto } from './dto/update-project_doc.dto';
import { ProjectDoc } from './entities/project_doc.entity';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { ApprovedStudentGuard } from '../../auth/project.approved.guard';
@UseGuards(JwtAuthGuard, RolesGuard, ApprovedStudentGuard)
@Controller('projects/:projectId/projectDocs')
export class ProjectDocController {
    constructor(private readonly projectDocsService: ProjectDocService) {}

    @Post('register')
    @Roles('instructor','student','admin')
    @UseInterceptors(FileInterceptor('file'))  // 'file' 필드에서 파일을 업로드 받음
    async create(
        @Param('projectId') projectId: number,
        @Body() createProjectDocDto: CreateProjectDocDto, 
        @UploadedFile() file: Express.Multer.File,// 업로드된 파일을 가져옴
    ): Promise<{ message: string; doc: any }> {

        const doc = await this.projectDocsService.create(projectId, createProjectDocDto, file);
        return { message: '프로젝트 문서가 성공적으로 등록되었습니다.', doc };
    }

    @Get()
    async findAll(@Param('projectId') projectId: number): Promise<{ doc: ProjectDoc[]; message: string }> {
        const doc = await this.projectDocsService.findAll(projectId);
        return { message: '전체 프로젝트 자료 조회를 완료했습니다.', doc };
    }

    @Get(':id/read')
    async findOne(
        @Param('id') id: number, 
        @Param('projectId') projectId: number
    ): Promise<{ doc: ProjectDoc; message: string }> {
        const doc = await this.projectDocsService.findOne(id, projectId);
        return { message: '프로젝트 자료 조회를 완료했습니다.', doc };
    }
    
    @Put(':id/update')
    @Roles('instructor','student','admin')
    async update(
        @Param('id') id: number, 
        @Body() updateProjectDocDto: UpdateProjectDocDto,
        @Param('projectId') projectId: number
    ): Promise<{ doc: ProjectDoc; message: string }> {
        const doc = await this.projectDocsService.update(id, updateProjectDocDto, projectId);
        return { message: '프로젝트 문서가 성공적으로 업데이트 되었습니다.', doc };
    }

    @Delete(':id/delete')
    @Roles('instructor','student','admin')
    async remove(
        @Param('id') id: number,
        @Param('projectId') projectId: number
    ): Promise<{ message: string }> {
        await this.projectDocsService.remove(id, projectId);
        return { message: '성공적으로 삭제되었습니다.' };
    }
}
