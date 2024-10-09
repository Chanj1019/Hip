import { Module, forwardRef } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './user.entity'; 
import { HashService } from '../auth/hash.service';
import { ProjectsModule } from '../project/projects/projects.module'; 
import * as dotenv from 'dotenv';
import { ExhibitionModule } from 'src/exhibition/exhibitions/exhibitions.module';
import { ExhibitionsDocModule } from 'src/exhibition/exhibitions_doc/exhibitions_doc.module';
import { CourseDocModule } from 'src/course/course_doc/course_doc.module';
import { DocNameModule } from 'src/course/doc_name/doc_name.module';
import { ProjectDocModule } from 'src/project/project_doc/project_doc.module';
dotenv.config();

// ProjectsModule 임포트
//손정민 작성
 @Module({
    imports: [
        TypeOrmModule.forFeature([User]),
        forwardRef(() => ProjectsModule),
        forwardRef(() => ExhibitionModule),
        forwardRef(() => ExhibitionsDocModule),
        forwardRef(() => CourseDocModule),
        forwardRef(() => DocNameModule),
        forwardRef(() => ProjectDocModule),
         // ProjectsModule을 forwardRef로 임포트
    ],
    providers: [UsersService,HashService],
    controllers: [UsersController],
    exports: [UsersService,HashService], // 필요한 경우 UsersService를 내보냄
})
export class UsersModule {}
