import { Controller, Post, Get, Patch, Delete, Param, Body } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';
import { DocNameResponseDto } from './dto/doc_name-with-coursedoc-response.dto';

@Controller('courses/:courseId/docNames')
export class DocNameController {
    constructor(private readonly docNameService: DocNameService) {}

    @Post('registerDN')
    async create(
        @Param('courseId') courseId: number, 
        @Body() createDocNameDto: CreateDocNameDto
    ): Promise<{ message: string; data: DocNameResponseDto }> {
        const docName = await this.docNameService.create(courseId, createDocNameDto);
        return {
            message: "doc_name 생성에 성공하셨습니다",
            data: new DocNameResponseDto(docName)
        };
    }

    @Patch('update/:topicId')
    async update(
        @Param('courseId') courseId: number, 
        @Param('topicId') topicId: number,
        @Body() updateDocNameDto: UpdateDocNameDto
    ): Promise<{ message: string; data: DocNameResponseDto }> {
        const docName = await this.docNameService.update(courseId, topicId, updateDocNameDto);
        return {
            message: "doc_name 수정에 성공하셨습니다",
            data: new DocNameResponseDto(docName)
        };
    }

    @Delete('/delete/:topicId')
    async remove(
        @Param('courseId') courseId: number, 
        @Param('topicId') topicId: number
    ): Promise<{ message: string }> {
        await this.docNameService.remove(courseId, topicId);
        return {
            message: "doc_name 삭제에 성공하셨습니다"
        };
    }
    
    // 조회는 course에서 쿼리빌더로 이루어짐.
    // @Get('allDN')
    // async findAll(
    //     @Param('courseId') courseId: number, 
    // ): Promise<{ message: string; data: DocNameResponseDto[] }> {
    //     const docNames = await this.docNameService.findAll(courseId);
    //     return {
    //         message: "전체 강의의 doc_name 조회에 성공하셨습니다",
    //         data: docNames.map(docName => new DocNameResponseDto(docName))
    //     };
    // }

    // @Get('root')
    // async findRootDocName(
    //     @Param('courseId') courseId: number, 
    // ): Promise<{ message: string; data: DocNameResponseDto }> {
    //     const docName = await this.docNameService.findRootDocName(courseId);
    //     return {
    //         message: "특정 강의의 pa_topic_id의 값을 null로 갖는 doc_name 조회에 성공하셨습니다",
    //         data: new DocNameResponseDto(docName)
    //     };
    // }

    // @Get(':topicId/read')
    // async findOne(
    //     @Param('courseId') courseId: number, 
    //     @Param('topicId') topicId: number
    // ): Promise<{ message: string; data: DocNameResponseDto }> {
    //     const docName = await this.docNameService.findOne(courseId, topicId);
    //     return {
    //         message: "특정 강의의 doc_name 조회에 성공하셨습니다",
    //         data: new DocNameResponseDto(docName)
    //     };
    // }
}