import { forwardRef, Module } from '@nestjs/common';
import { DocNameService } from './doc_name.service';
import { DocNameController } from './doc_name.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CourseDoc } from '../../course/course_doc/entities/course_doc.entity'
import { Course } from '../courses/entities/course.entity'
import { DocName } from './entities/doc_name.entity'
import { UsersModule } from '../../user/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Course, CourseDoc, DocName]),
        forwardRef(() => UsersModule),
    ],
    controllers: [DocNameController],
    providers: [DocNameService],
    exports: [DocNameService]
})
export class DocNameModule {}
