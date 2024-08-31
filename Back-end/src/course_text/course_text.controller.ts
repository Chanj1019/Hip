import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { CourseTextService } from './course_text.service';
import { CreateCourseTextDto } from './dto/create-course_text.dto';
import { UpdateCourseTextDto } from './dto/update-course_text.dto';

@Controller('course-text')
export class CourseTextController {
  constructor(private readonly courseTextService: CourseTextService) {}

  @Post()
  async create(@Body() createCourseTextDto: CreateCourseTextDto) {
    return await this.courseTextService.create(createCourseTextDto);
  }

  @Get()
  async findAll() {
    return await this.courseTextService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.courseTextService.findOne(+id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateCourseTextDto: UpdateCourseTextDto) {
    return await this.courseTextService.update(+id, updateCourseTextDto);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    return await this.courseTextService.remove(+id);
  }
}
