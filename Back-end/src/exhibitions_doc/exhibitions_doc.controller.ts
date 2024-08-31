import { Controller, Get, Post, Put, Delete, Body, Param ,HttpCode, Res,HttpStatus} from '@nestjs/common';
import { ExhibitionsDocService } from './exhibitions_doc.service';
import { CreateExhibitionsDocDto } from './dto/create-exhibitions_doc.dto';
import { UpdateExhibitionsDocDto } from './dto/update-exhibitions_doc.dto';
import { ExhibitionDoc } from './entities/exhibition_doc.entity';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
@Controller('exhibition-docs')
export class ExhibitionsDocController {
  constructor(private readonly exhibitionDocsService: ExhibitionsDocService) {}

  @Get()
  async findAll(): Promise<{doc:ExhibitionDoc[];message:string}> {
    const doc = await this.exhibitionDocsService.findAll();
    return {message:'전체 자료 조회를 완료했습니다.',doc};
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<{doc:ExhibitionDoc; message:string}> {
    const doc =await this.exhibitionDocsService.findOne(id);
    return {message:'자료 조회를 완료했습니다.',doc};
  }

  // @Post('register')
  // @UseInterceptors(FileInterceptor('file')) // 'file' 필드에서 파일을 업로드 받음
  // async createExhibitionDoc(
  //   @Body() createExhibitionDocDto: CreateExhibitionsDocDto,
  //   @UploadedFile() file: Express.Multer.File, // 업로드된 파일을 가져옴
  // ) {
  //   // createExhibitionDoc 메소드를 호출하고 결과 반환
  //   return this.exhibitionDocsService.createExhibitionDoc(createExhibitionDocDto,file);
  // }
    @Post('register')
  @UseInterceptors(FileInterceptor('file')) // 'file' 필드에서 파일을 업로드 받음
  async createExhibitionDoc(
    @Body() createExhibitionDocDto: CreateExhibitionsDocDto,
    @UploadedFile() file: Express.Multer.File, // 업로드된 파일을 가져옴
  ): Promise<{ message: string; doc: any }> { // 반환 타입 정의
    const doc = await this.exhibitionDocsService.createExhibitionDoc(createExhibitionDocDto, file);
    return { message: '전시 문서가 성공적으로 등록되었습니다.', doc };
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateExhibitionsDocDto: UpdateExhibitionsDocDto,
  ): Promise<{doc:ExhibitionDoc; message:string}> {
    const doc = await this.exhibitionDocsService.update(id, updateExhibitionsDocDto);
    return {message: '전시 문서가 성공적으로 업데이트 되었습니다.',doc};
  } 
  
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response): Promise<Response> {
      const message = await this.exhibitionDocsService.remove(id);
      return res.status(200).json({ message:'성공적으로 삭제되었습니다.' });
  }
}
