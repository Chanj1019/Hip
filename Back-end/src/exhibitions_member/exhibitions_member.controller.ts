import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { CreateExhibitionsMemberDto } from './dto/create-exhibitions_member.dto';
import { UpdateExhibitionsMemberDto } from './dto/update-exhibitions_member.dto';

@Controller('exhibitions-member')
export class ExhibitionsMemberController {
  constructor(private readonly exhibitionsMemberService: ExhibitionsMemberService) {}

  @Post()
  create(@Body() createExhibitionsMemberDto: CreateExhibitionsMemberDto) {
    return this.exhibitionsMemberService.create(createExhibitionsMemberDto);
  }

  @Get()
  findAll() {
    return this.exhibitionsMemberService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.exhibitionsMemberService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateExhibitionsMemberDto: UpdateExhibitionsMemberDto) {
    return this.exhibitionsMemberService.update(+id, updateExhibitionsMemberDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.exhibitionsMemberService.remove(+id);
  }
}
