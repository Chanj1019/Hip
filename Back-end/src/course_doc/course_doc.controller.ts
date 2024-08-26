import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseDocService } from './course_doc.service';
import { CreateCourseDocDto } from './dto/create-course_doc.dto';
import { UpdateCourseDocDto } from './dto/update-course_doc.dto';

@Controller('courses/:courseId/doc-names/:docNameId/course-docs')
export class CourseDocController {
  constructor(private readonly courseDocService: CourseDocService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async createfile(
    @Param('courseId') courseId: number,
    @Param('docNameId') docNameId: number,
    @Body() createCourseDocDto: CreateCourseDocDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const data = await this.courseDocService.createfile(courseId, docNameId, createCourseDocDto, file);
    return {
      message: "Course Document가 성공적으로 생성되었습니다.",
      data: data,
    };
  }

  @Post('text')
  async createtext(
    @Param('courseId') courseId: number,
    @Param('docNameId') docNameId: number,
    @Body() createCourseDocDto: CreateCourseDocDto
  ) {
    const data = await this.courseDocService.createtext(courseId, docNameId, createCourseDocDto);
    return {
      message: "Course Document가 성공적으로 생성되었습니다.",
      data: data,
    };
  }

  @Get()
  async findAll(
    @Param('courseId') courseId: number,
    @Param('docNameId') docNameId: number
  ) {
    const data = await this.courseDocService.findAll(courseId, docNameId);
    return {
      message: "Course Documents 조회에 성공하셨습니다.",
      data: data,
    };
  }

  @Get(':id')
  async findOne(
    @Param('courseId') courseId: number,
    @Param('docNameId') docNameId: number,
    @Param('id') id: number
  ) {
    const data = await this.courseDocService.findOne(courseId, docNameId, id);
    return {
      message: "Course Document 조회에 성공하셨습니다.",
      data: data,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('courseId') courseId: number, 
    @Param('docNameId') docNameId: number,
    @Param('id') id: number,
    @Body() updateCourseDocDto: UpdateCourseDocDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const data = await this.courseDocService.update(courseId, docNameId, id, updateCourseDocDto, file);
    return {
      message: "Course Document가 성공적으로 수정되었습니다.",
      data: data,
    };
  }

  @Delete(':id')
  async remove(
    @Param('courseId') courseId: number,
    @Param('docNameId') docNameId: number,
    @Param('id') id: number
  ) {
    await this.courseDocService.remove(courseId, docNameId, id);
    return {
      message: "Course Document가 성공적으로 삭제되었습니다.",
    };
  }
}