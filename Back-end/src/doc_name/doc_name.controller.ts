import { Controller, Post, Get, Patch, Delete, Param, Body, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { CreateDocNameDto } from './dto/create-doc_name.dto'; // CreateDocNameDto 임포트
import { UpdateDocNameDto } from './dto/update-doc_name.dto'; // UpdateDocNameDto 임포트

@Controller('courses/:courseTitle')
export class DocNameController {
    constructor(private readonly docNameService: DocNameService) {}

    @Post('registerDN')
    async create(
        @Param('courseTitle') courseTitle: string,
        @Param('topicTitle') topicTitle: string,
        @Body() createDocNameDto: CreateDocNameDto
    ) {
        const data = await this.docNameService.create(courseTitle, topicTitle, createDocNameDto);
        return {
            message: "doc_name 생성에 성공하셨습니다",
            data: data
        };
    }

    @Get('allVT')
    async findAll() {
        const data = await this.docNameService.findAll();
        return {
            message: "전체 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get(':topicTitle')
    async findOne(
      @Param('topicTitle') topicTitle: string
    ) {
        const data = await this.docNameService.findOne(topicTitle);
        return {
            message: "특정 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':topicTitle')
    async update(
      @Param('topicTitle') topicTitle: string,
      @Body() updateDocNameDto: UpdateDocNameDto
    ) {
        const data = await this.docNameService.update(topicTitle, updateDocNameDto);
        return {
          message: "doc_name 수정에 성공하셨습니다",
          data: data
        };
    }
  

    @Delete(':topicTitle')
    async remove(
      @Param('topicTitle') topicTitle: string
    ) {
        const data = await this.docNameService.remove(topicTitle);
        return {
            message: "doc_name 삭제에 성공하셨습니다",
            data: data
        };
    }
}