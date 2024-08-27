import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { CreateDocNameDto } from './dto/create-doc_name.dto'; // CreateDocNameDto 임포트
import { UpdateDocNameDto } from './dto/update-doc_name.dto'; // UpdateDocNameDto 임포트

@Controller('courses/:courseTitle/doc-names')
export class DocNameController {
    constructor(private readonly docNameService: DocNameService) {}

    @Post()
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

    @Get()
    async findAll(
      @Param('courseTitle') courseTitle: string
    ) {
        const data = await this.docNameService.findAll(courseTitle);
        return {
            message: "특정 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':id')
    async update(
        @Param('courseTitle') courseTitle: string,
        @Param('id') id: number,
        @Body() updateDocNameDto: UpdateDocNameDto
    ) {
        const data = await this.docNameService.update(courseTitle, id, updateDocNameDto);
        return {
            message: "doc_name 수정에 성공하셨습니다",
            data: data
        };
    }

    @Delete(':id')
    async remove(
      @Param('id') id: number
    ) {
        const data = await this.docNameService.remove(id);
        return {
            message: "doc_name 삭제에 성공하셨습니다",
            data: data
        };
    }
}
