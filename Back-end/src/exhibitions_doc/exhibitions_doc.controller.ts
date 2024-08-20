import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExhibitionsDocService } from './exhibitions_doc.service';
import { CreateExhibitionsDocDto } from './dto/create-exhibitions_doc.dto';
import { UpdateExhibitionsDocDto } from './dto/update-exhibitions_doc.dto';

@Controller('exhibitions-doc')
export class ExhibitionsDocController {
  constructor(private readonly exhibitionsDocService: ExhibitionsDocService) {}

  @Post()
  create(@Body() createExhibitionsDocDto: CreateExhibitionsDocDto) {
    return this.exhibitionsDocService.create(createExhibitionsDocDto);
  }

  @Get()
  findAll() {
    return this.exhibitionsDocService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitionsDocService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExhibitionsDocDto: UpdateExhibitionsDocDto) {
    return this.exhibitionsDocService.update(+id, updateExhibitionsDocDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exhibitionsDocService.remove(+id);
  }
}
