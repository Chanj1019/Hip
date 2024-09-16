import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ExhibitionModule } from './exhibitions/exhibitions.module';
import { Exhibition } from './exhibitions/exhibition.entity';
import { Course } from './courses/entities/course.entity'
import { CoursesModule } from './courses/courses.module';
import { UCat } from './ucat/entities/ucat.entity';
import { UcatModule } from './ucat/ucat.module';
import { DocNameModule } from './doc_name/doc_name.module';
import { DocName } from './doc_name/entities/doc_name.entity';
import { CourseDoc } from './course_doc/entities/course_doc.entity';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { CourseDocModule } from './course_doc/course_doc.module';
import { VideoTopicModule } from './video_topic/video_topic.module';
import { VideoModule } from './video/video.module';
import { ExhibitionDoc } from './exhibitions_doc/entities/exhibition_doc.entity';
import { ExhibitionsDocModule } from './exhibitions_doc/exhibitions_doc.module';
import { ExhibitionMember } from './exhibitions_member/entities/exhibition_member.entity';
import { ExhibitionsMemberModule } from './exhibitions_member/exhibitions_member.module';
import { ExhibitionIntroModule } from './exhibition_intro/exhibition_intro.module';
import { ExhibitionIntro } from './exhibition_intro/entities/exhibition_intro.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './projects/projects.module';
import { Project } from './projects/entities/project.entity';
import { ProjectDocModule } from './project_doc/project_doc.module';
import { Project_doc } from './project_doc/entities/project_doc.entity';
import { RegistrationModule } from './registration/registration.module';
import { Registration } from './registration/entities/registration.entity';
import { FeedbackModule } from './feedback/feedback.module';
import { Feedback } from './feedback/entities/feedback.entity';
import { VideoTopic } from './video_topic/entities/video_topic.entity';

@Module({
    imports: [
        ConfigModule.forRoot(), // ConfigModule 추가
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: process.env.DB_TYPE as 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT, 10),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,
                entities: [User,Exhibition,ExhibitionDoc,ExhibitionMember,ExhibitionIntro,
                    Project,Project_doc, Registration,Feedback, Course, UCat, DocName, CourseDoc, VideoTopic],
                synchronize: true,
            }),
        }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '..', 'public'),
        }),
        MulterModule.register({
            dest: './uploads',
        }),
        UsersModule,ExhibitionsDocModule,ExhibitionsMemberModule, ProjectsModule, ProjectDocModule, RegistrationModule, FeedbackModule,
        CoursesModule,ExhibitionIntroModule,ExhibitionModule,
        UcatModule,
        DocNameModule,
        CourseDocModule,
        VideoTopicModule,
        VideoModule,
        AuthModule,
    ],
})
export class AppModule {}
