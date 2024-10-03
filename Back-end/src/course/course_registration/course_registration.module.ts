import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseRegistrationService } from './course_registration.service';
import { CourseRegistrationController } from './course_registration.controller';
import { CourseRegistration } from './entities/course_registration.entity';
import { Course } from '../courses/entities/course.entity';
import { User } from 'src/user/user.entity';
import { UsersModule } from 'src/user/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CourseRegistration, Course, User]),
    forwardRef(() => UsersModule),
],
  controllers: [CourseRegistrationController],
  providers: [CourseRegistrationService],
  exports: [CourseRegistrationService],
})
export class CourseRegistrationModule {}
