import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExhibitionIntroService } from './exhibition_intro.service';
import { CreateExhibitionIntroDto } from './dto/create-exhibition_intro.dto';
import { UpdateExhibitionIntroDto } from './dto/update-exhibition_intro.dto';

@Controller('exhibition-intro')
export class ExhibitionIntroController {
  constructor(private readonly exhibitionIntroService: ExhibitionIntroService) {}

  @Post('register')
  async create(@Body() createExhibitionIntroDto: CreateExhibitionIntroDto) {
    return await this.exhibitionIntroService.create(createExhibitionIntroDto);
  }

  @Get()
  async findAll() {
    return await this.exhibitionIntroService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.exhibitionIntroService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateExhibitionIntroDto: UpdateExhibitionIntroDto) {
    return await this.exhibitionIntroService.update(+id, updateExhibitionIntroDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.exhibitionIntroService.remove(+id);
  }
}
