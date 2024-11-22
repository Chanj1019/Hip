import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';
import { DocNameWithCourseDocResponseDto } from './dto/doc_name-with-coursedoc-response.dto';

@Controller('courses/:courseId/docNames')
export class DocNameController {
    constructor(private readonly docNameService: DocNameService) {}

    @Post('registerDN')
    async create(
        @Param('courseId') courseId: number, 
        @Body() createDocNameDto: CreateDocNameDto
    ): Promise<{ message: string; data: DocNameWithCourseDocResponseDto }> {
        const docName = await this.docNameService.create(courseId, createDocNameDto);
        return {
            message: "doc_name 생성에 성공하셨습니다",
            data: new DocNameWithCourseDocResponseDto(docName)
        };
    }

    @Patch('update/:topicId')
    async update(
        @Param('courseId') courseId: number, 
        @Param('topicId') topicId: number,
        @Body() updateDocNameDto: UpdateDocNameDto
    ): Promise<{ message: string; data: DocNameWithCourseDocResponseDto }> {
        const docName = await this.docNameService.update(courseId, topicId, updateDocNameDto);
        return {
            message: "doc_name 수정에 성공하셨습니다",
            data: new DocNameWithCourseDocResponseDto(docName)
        };
    }

    @Delete(':topicId/delete')
    async remove(
        @Param('courseId') courseId: number, 
        @Param('topicId') topicId: number
    ): Promise<{ message: string }> {
        await this.docNameService.remove(courseId, topicId);
        return {
            message: "doc_name 삭제에 성공하셨습니다"
        };
    }
    
    @Get('allDN')
    async findAll(
        @Param('courseId') courseId: number, 
    ): Promise<{ message: string; data: DocNameWithCourseDocResponseDto[] }> {
        const docNames = await this.docNameService.findAll(courseId);
        return {
            message: "전체 강의의 doc_name 조회에 성공하셨습니다",
            data: docNames.map(docName => new DocNameWithCourseDocResponseDto(docName))
        };
    }

    @Get('root')
    async findRootDocNames(
        @Param('courseId') courseId: number
    ): Promise<{ message: string; data: DocNameWithCourseDocResponseDto[] }> {
        const docNames = await this.docNameService.findRootDocName(courseId);
        return {
            message: "최상위 디렉토리 doc_names 조회에 성공하셨습니다",
            data: docNames.map(docName => new DocNameWithCourseDocResponseDto(docName))
        };
    }

    @Get(':topicId/read')   
    async findOne(
        @Param('courseId') courseId: number, 
        @Param('topicId') topicId: number
    ): Promise<{ message: string; data: DocNameWithCourseDocResponseDto }> {
        const docName = await this.docNameService.findDocTopic(courseId, topicId);
        return {
            message: "특정 강의의 doc_name 조회에 성공하셨습니다",
            data: docName
        };
    }
}