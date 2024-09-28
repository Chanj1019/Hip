import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { CourseRegistrationService } from './course_registration.service';
import { CreateCourseRegistrationDto } from './dto/create-course_registration.dto';
import { UpdateCourseRegistrationDto } from './dto/update-course_registration.dto';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';

@Controller('courses/:course/courseRegistration')
export class CourseRegistrationController {
  constructor(private readonly courseRegistrationService: CourseRegistrationService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Post('register')
  @Roles('instructor','student')
  create(@Body() createCourseRegistrationDto: CreateCourseRegistrationDto) {
    return this.courseRegistrationService.create(createCourseRegistrationDto);
  }

  @Get()
  @Roles('admin')
  findAll() {
    return this.courseRegistrationService.findAll();
  }

  // @Get(':id')
  // findOne(@Param('id') id: string) {
  //   return this.courseRegistrationService.findOne(+id);
  // }

  @Patch(':id')
  @Roles('admin')
  update(@Param('id') id: string, @Body() updateCourseRegistrationDto: UpdateCourseRegistrationDto) {
    return this.courseRegistrationService.update(+id, updateCourseRegistrationDto);
  }

  @Delete(':id')
  @Roles('instructor','student')
  remove(@Param('id') id: string) {
    return this.courseRegistrationService.remove(+id);
  }
}
