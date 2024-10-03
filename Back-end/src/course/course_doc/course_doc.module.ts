import { forwardRef, Module } from '@nestjs/common';
import { CourseDocService } from './course_doc.service';
import { CourseDocController } from './course_doc.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseDoc } from './entities/course_doc.entity'
import { DocName } from '../doc_name/entities/doc_name.entity'
import { ConfigModule } from '@nestjs/config';
import { Course } from '../courses/entities/course.entity';
import { ConfigService } from '@nestjs/config';
import { UsersModule } from '../../user/users.module';

@Module({
    imports: [
        ConfigModule,
        TypeOrmModule.forFeature([CourseDoc, DocName, Course]),
        forwardRef(() => UsersModule),
    ],
    controllers: [CourseDocController],
    providers: [CourseDocService, ConfigService],
    exports: [CourseDocService],
})
export class CourseDocModule {}
