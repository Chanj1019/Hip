import { Controller, Get, Post, Put, Delete, Body, Param ,HttpCode,HttpStatus} from '@nestjs/common';
import { ExhibitionsDocService } from './exhibitions_doc.service';
import { CreateExhibitionsDocDto } from './dto/create-exhibitions_doc.dto';
import { UpdateExhibitionsDocDto } from './dto/update-exhibitions_doc.dto';
import { ExhibitionDoc } from './entities/exhibition_doc.entity';

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
    @HttpCode(HttpStatus.CREATED)
    async create(@Body() createExhibitionDocDto: CreateExhibitionsDocDto): Promise<ExhibitionDoc> {
        return this.exhibitionDocsService.createExhibitionDoc(createExhibitionDocDto);
  }
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() updateExhibitionsDocDto: UpdateExhibitionsDocDto,
  ): Promise<ExhibitionDoc> {
    return await this.exhibitionDocsService.update(id, updateExhibitionsDocDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: number): Promise<void> {
    return await this.exhibitionDocsService.remove(id);
  }
}
