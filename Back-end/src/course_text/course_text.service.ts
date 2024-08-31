import { Injectable } from '@nestjs/common';
import { CreateCourseTextDto } from './dto/create-course_text.dto';
import { UpdateCourseTextDto } from './dto/update-course_text.dto';

@Injectable()
export class CourseTextService {
  async create(createCourseTextDto: CreateCourseTextDto) {
    return await 'This action adds a new courseText';
  }

  async findAll() {
    return await `This action returns all courseText`;
  }

  async findOne(id: number) {
    return await `This action returns a #${id} courseText`;
  }

  async update(id: number, updateCourseTextDto: UpdateCourseTextDto) {
    return await `This action updates a #${id} courseText`;
  }

  async remove(id: number) {
    return await `This action removes a #${id} courseText`;
  }
}
