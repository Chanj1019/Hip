import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExhibitionIntroService } from './exhibition_intro.service';
import { CreateExhibitionIntroDto } from './dto/create-exhibition_intro.dto';
import { UpdateExhibitionIntroDto } from './dto/update-exhibition_intro.dto';

@Controller('exhibition-intro')
export class ExhibitionIntroController {
  constructor(private readonly exhibitionIntroService: ExhibitionIntroService) {}

  @Post()
  create(@Body() createExhibitionIntroDto: CreateExhibitionIntroDto) {
    return this.exhibitionIntroService.create(createExhibitionIntroDto);
  }

  @Get()
  findAll() {
    return this.exhibitionIntroService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitionIntroService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExhibitionIntroDto: UpdateExhibitionIntroDto) {
    return this.exhibitionIntroService.update(+id, updateExhibitionIntroDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exhibitionIntroService.remove(+id);
  }
}
