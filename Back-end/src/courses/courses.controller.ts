import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { CoursesService } from './courses.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { Course } from './entities/course.entity'

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  async createCourse(@Body() createCourseDto: CreateCourseDto) {
    const data = await this.coursesService.createCourse(createCourseDto);
    return {
      message: "Course가 성공적으로 생성되었습니다.",
      data: data,
    };
  }

  @Get()
  async getAllCourses() {
    return this.coursesService.getAllCourses();
  }

  @Get(':id')
  async getOneCourse(@Param('id') id: number): Promise<Course> {
    return this.coursesService.getOneCourse(id);
  }

  @Put(':id')
  async updateCourse(
    @Param('id') id: number,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    const data = this.coursesService.updateCourse(id, updateCourseDto);
    return {
      message: "Course가 성공적으로 수정되었습니다.",
      data: data
    }
  }

  @Delete(':id')
  async deleteCourse(@Param('id') id: number) {
    const data = this.coursesService.deleteCourse(id); // Convert to number
    return {
      message: "Course가 성공적으로 삭제되었습니다.",
      data: data
    }
  }
}
