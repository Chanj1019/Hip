import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseDocService } from './course_doc.service';
import { CreateCourseDocDto } from './dto/create-course_doc.dto';
import { UpdateCourseDocDto } from './dto/update-course_doc.dto';

@Controller('course-doc')
export class CourseDocController {
  constructor(private readonly courseDocService: CourseDocService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async createCourseDoc(@Body() createCourseDocDto: CreateCourseDocDto, @UploadedFile() file: Express.Multer.File) {
    const data = await this.courseDocService.createCourseDoc(createCourseDocDto, file);
    return {
      message: "Course Document가 성공적으로 생성되었습니다.",
      data: data,
    };
  }

  @Get()
  async findAll() {
    return await this.courseDocService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.courseDocService.findOne(+id);
  }

  @Patch(':id')
  @UseInterceptors(FileInterceptor('file'))
  async update(@Param('id') id: string, @Body() updateCourseDocDto: UpdateCourseDocDto, @UploadedFile() file: Express.Multer.File) {
    const data = await this.courseDocService.update(+id, updateCourseDocDto, file);
    return {
      message: "Course Document가 성공적으로 수정되었습니다.",
      data: data,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.courseDocService.remove(+id);
    return {
      message: "Course Document가 성공적으로 삭제되었습니다.",
    };
  }
}