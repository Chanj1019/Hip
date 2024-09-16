import { Controller , Get , Post , Body , NotFoundException , Param , Delete ,UseGuards , UseInterceptors , UploadedFile , Res } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseDocService } from './course_doc.service';
import { CreateCourseDocDto } from './dto/create-course_doc.dto';
import { Response } from 'express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';

@UseGuards(JwtAuthGuard,RolesGuard)
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
    // const sanitizedDocNameTitle = docNameTitle.replace(/ /g, '');
    const data = await this.courseDocService.uploadFile(courseTitle, docNameTitle, createCourseDocDto, file);
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

  @Get('download/:fileName')
  async downloadFile(@Param('fileName') fileName: string, @Res() res: Response) {
    try {
      const { stream, metadata } = await this.courseDocService.downloadFile(fileName);

      res.set({
        'Content-Type': metadata.ContentType || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': metadata.ContentLength,
      });

      // res.end(fileBuffer);
      stream.pipe(res);
    } catch (error) {
      console.error('파일 다운로드 중 오류 발생:', error);
      throw new NotFoundException('파일 다운로드에 실패했습니다.');
    }
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