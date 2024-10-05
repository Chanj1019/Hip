import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { CreateDocNameDto } from './dto/create-doc_name.dto'; // CreateDocNameDto 임포트
import { UpdateDocNameDto } from './dto/update-doc_name.dto'; // UpdateDocNameDto 임포트

@Controller('courses/:courseId/docNames')
export class DocNameController {
    constructor(private readonly docNameService: DocNameService) {}

    @Post('registerDN')
    async create(
        @Param('courseId') courseId: number, 
        @Body() createDocNameDto: CreateDocNameDto
    ) {
        const data = await this.docNameService.create(courseId, createDocNameDto);
        return {
            message: "doc_name 생성에 성공하셨습니다",
            data: data
        };
    }

    @Get('allDN')
    async findAll(
        @Param('courseId') courseId: number, 
    ) {
        const data = await this.docNameService.findAll(courseId);
        return {
            message: "전체 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get('root')
    async findRootDocName(
        @Param('courseId') courseId: number, 
    ) {
        const data = await this.docNameService.findRootDocName(courseId);
        return {
            message: "특정 강의의 pa_topic_id의 값을 null로 갖는 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get(':topicId')
    async findOne(
        @Param('courseId') courseId: number, 
        @Param('topicId') topicId: number
    ) {
        const data = await this.docNameService.findOne(courseId, topicId);
        return {
            message: "특정 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':topicId')
    async update(
        @Param('courseId') courseId: number, 
        @Param('topicId') topicId: number,
        @Body() updateDocNameDto: UpdateDocNameDto
    ) {
        const data = await this.docNameService.update(courseId, topicId, updateDocNameDto);
        return {
          message: "doc_name 수정에 성공하셨습니다",
          data: data
        };
    }
  

    @Delete(':topicId')
    async remove(
        @Param('courseId') courseId: number, 
        @Param('topicId') topicId: number
    ) {
        const data = await this.docNameService.remove(courseId, topicId);
        return {
            message: "doc_name 삭제에 성공하셨습니다",
            data: data
        };
    }
}