import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';

@Controller('doc-name')
export class DocNameController {
  constructor(private readonly docNameService: DocNameService) {}

  @Post()
  create(@Body() createDocNameDto: CreateDocNameDto) {
    return this.docNameService.create(createDocNameDto);
  }

  @Get()
  findAll() {
    return this.docNameService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.docNameService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateDocNameDto: UpdateDocNameDto) {
    return this.docNameService.update(+id, updateDocNameDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.docNameService.remove(+id);
  }
}
