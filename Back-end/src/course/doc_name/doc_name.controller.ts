import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { CreateDocNameDto } from './dto/create-doc_name.dto'; // CreateDocNameDto 임포트
import { UpdateDocNameDto } from './dto/update-doc_name.dto'; // UpdateDocNameDto 임포트

@Controller('courses/:courseTitle/docNames')
export class DocNameController {
    constructor(private readonly docNameService: DocNameService) {}

    @Post('registerDN')
    async create(
        @Param('courseTitle') courseTitle: string,
        @Body() createDocNameDto: CreateDocNameDto
    ) {
        const data = await this.docNameService.create(courseTitle, createDocNameDto);
        return {
            message: "doc_name 생성에 성공하셨습니다",
            data: data
        };
    }

    @Get('allDN')
    async findAll(
        @Param('courseTitle') courseTitle: string
    ) {
        const data = await this.docNameService.findAll(courseTitle);
        return {
            message: "전체 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get(':topicTitle')
    async findOne(
        @Param('courseTitle') courseTitle: string,
        @Param('topicTitle') topicTitle: string
    ) {
        const data = await this.docNameService.findOne(courseTitle, topicTitle);
        return {
            message: "특정 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':topicTitle')
    async update(
        @Param('courseTitle') courseTitle: string,
        @Param('topicTitle') topicTitle: string,
        @Body() updateDocNameDto: UpdateDocNameDto
    ) {
        const data = await this.docNameService.update(courseTitle, topicTitle, updateDocNameDto);
        return {
          message: "doc_name 수정에 성공하셨습니다",
          data: data
        };
    }
  

    @Delete(':topicTitle')
    async remove(
        @Param('courseTitle') courseTitle: string,
        @Param('topicTitle') topicTitle: string
    ) {
        const data = await this.docNameService.remove(courseTitle, topicTitle);
        return {
            message: "doc_name 삭제에 성공하셨습니다",
            data: data
        };
    }
}