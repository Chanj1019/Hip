import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseDocService } from './course_doc.service';
import { CreateCourseDocDto } from './dto/create-course_doc.dto';
import { UpdateCourseDocDto } from './dto/update-course_doc.dto';

@Controller('courses/:courseTitle/doc-names/:docNameTitle/course-docs')
export class CourseDocController {
  constructor(private readonly courseDocService: CourseDocService) {}

  @Post('file')
  @UseInterceptors(FileInterceptor('file'))
  async createfile(
    @Param('courseTitle') courseTitle: string,
    @Param('docNameTitle') docNameTitle: string,
    @Body() createCourseDocDto: CreateCourseDocDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const data = await this.courseDocService.createfile(courseTitle, docNameTitle, createCourseDocDto, file);
    return {
      message: "Course Document가 성공적으로 생성되었습니다.",
      data: data,
    };
  }

  @Post('text')
  async createtext(
    @Param('courseTitle') courseTitle: string,
    @Param('docNameTitle') docNameTitle: string,
    @Body() createCourseDocDto: CreateCourseDocDto
  ) {
    const data = await this.courseDocService.createtext(courseTitle, docNameTitle, createCourseDocDto);
    return {
      message: "Course Document가 성공적으로 생성되었습니다.",
      data: data,
    };
  }

  @Get()
  async findAll(
    @Param('courseTitle') courseTitle: string,
    @Param('docNameTitle') docNameTitle: string
  ) {
    const data = await this.courseDocService.findAll(courseTitle, docNameTitle);
    return {
      message: "Course Documents 조회에 성공하셨습니다.",
      data: data,
    };
  }

  @Get(':id')
  async findOne(
    @Param('courseTitle') courseTitle: string,
    @Param('docNameTitle') docNameTitle: string,
    @Param('id') id: number
  ) {
    const data = await this.courseDocService.findOne(courseTitle, docNameTitle, id);
    return {
      message: "Course Document 조회에 성공하셨습니다.",
      data: data,
    };
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(
    @Param('courseTitle') courseTitle: string, 
    @Param('docNameTitle') docNameTitle: string,
    @Param('id') id: number,
    @Body() updateCourseDocDto: UpdateCourseDocDto, 
    @UploadedFile() file: Express.Multer.File
  ) {
    const data = await this.courseDocService.update(courseTitle, docNameTitle, id, updateCourseDocDto, file);
    return {
      message: "Course Document가 성공적으로 수정되었습니다.",
      data: data,
    };
  }

  @Delete(':id')
  async remove(
    @Param('courseTitle') courseTitle: string,
    @Param('docNameTitle') docNameTitle: string,
    @Param('id') id: number
  ) {
    await this.courseDocService.remove(courseTitle, docNameTitle, id);
    return {
      message: "Course Document가 성공적으로 삭제되었습니다.",
    };
  }
}