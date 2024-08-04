// courses.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { Course } from './course.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Course])],
  providers: [CoursesService],
  controllers: [CoursesController]
})
export class CoursesModule {}