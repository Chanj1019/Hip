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
  async findAll(): Promise<ExhibitionDoc[]> {
    return await this.exhibitionDocsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<ExhibitionDoc> {
    return await this.exhibitionDocsService.findOne(id);
  }

  @Post('register')
  @UseInterceptors(FileInterceptor('file')) // 'file' 필드에서 파일을 업로드 받음
  async createExhibitionDoc(
    @Body() createExhibitionDocDto: CreateExhibitionsDocDto,
    @UploadedFile() file: Express.Multer.File, // 업로드된 파일을 가져옴
  ) {
    // createExhibitionDoc 메소드를 호출하고 결과 반환
    return this.exhibitionDocsService.createExhibitionDoc(createExhibitionDocDto,file);
  }
  
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateExhibitionsDocDto: UpdateExhibitionsDocDto,
  ): Promise<ExhibitionDoc> {
    return await this.exhibitionDocsService.update(id, updateExhibitionsDocDto);
  } 
  
  @Delete(':id')
  async remove(@Param('id') id: number, @Res() res: Response): Promise<Response> {
      const message = await this.exhibitionDocsService.remove(id);
      return res.status(200).json({ message });
  }
}
