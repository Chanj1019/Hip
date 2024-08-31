import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseDocService } from './course_doc.service';
import { CreateCourseDocDto } from './dto/create-course_doc.dto';
import { UpdateCourseDocDto } from './dto/update-course_doc.dto';

@Controller('courses/:courseTitle/docNames/:docNameTitle/courseDocs')
export class CourseDocController {
  constructor(private readonly courseDocService: CourseDocService) {}

  @Post('register')
  @UseInterceptors(FileInterceptor('file'))
  async create(
    @Param('courseTitle') courseTitle: string,
    @Param('docNameTitle') docNameTitle: string,
    @Body() createCourseDocDto: CreateCourseDocDto,
    @UploadedFile() file: Express.Multer.File
  ) {
    const data = await this.courseDocService.uploadFile(createCourseDocDto, file);
    return {
      message: "File을 성공적으로 업로드 하셨습니다.",
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

  // 특정 강의 자료 조회
  // @Get(':id')
  // async findOne(
  //   @Param('courseTitle') courseTitle: string,
  //   @Param('docNameTitle') docNameTitle: string,
  //   @Param('id') id: number
  // ) {
  //   const data = await this.courseDocService.findOne(courseTitle, docNameTitle, id);
  //   return {
  //     message: "Course Document 조회에 성공하셨습니다.",
  //     data: data,
  //   };
  // }

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