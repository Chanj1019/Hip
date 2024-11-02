import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './user/users.module';
import { User } from './user/user.entity';
import { ExhibitionModule } from './exhibition/exhibitions/exhibitions.module';
import { Exhibition } from './exhibition/exhibitions/exhibition.entity';
import { Course } from './course/courses/entities/course.entity'
import { CoursesModule } from './course/courses/courses.module';
import { DocNameModule } from './course/doc_name/doc_name.module';
import { DocName } from './course/doc_name/entities/doc_name.entity';
import { CourseDoc } from './course/course_doc/entities/course_doc.entity';
import { join } from 'path';
import { ServeStaticModule } from '@nestjs/serve-static';
import { MulterModule } from '@nestjs/platform-express';
import { CourseDocModule } from './course/course_doc/course_doc.module';
import { VideoTopicModule } from './course/video_topic/video_topic.module';
import { VideoModule } from './course/video/video.module';
import { ExhibitionDoc } from './exhibition/exhibitions_doc/entities/exhibition_doc.entity';
import { ExhibitionsDocModule } from './exhibition/exhibitions_doc/exhibitions_doc.module';
import { ExhibitionMember } from './exhibition/exhibitions_member/entities/exhibition_member.entity';
import { ExhibitionsMemberModule } from './exhibition/exhibitions_member/exhibitions_member.module';
import { ExhibitionIntroModule } from './exhibition/exhibition_intro/exhibition_intro.module';
import { ExhibitionIntro } from './exhibition/exhibition_intro/entities/exhibition_intro.entity';
import { AuthModule } from './auth/auth.module';
import { ProjectsModule } from './project/projects/projects.module';
import { Project } from './project/projects/entities/project.entity';
import { ProjectDocModule } from './project/project_doc/project_doc.module';
import { ProjectDoc } from './project/project_doc/entities/project_doc.entity';
import { ProjectRegistrationModule } from './project/project_registration/registration.module';
import { ProjectRegistration } from './project/project_registration/entities/registration.entity';
import { FeedbackModule } from './project/feedback/feedback.module';
import { Feedback } from './project/feedback/entities/feedback.entity';
import { VideoTopic } from './course/video_topic/entities/video_topic.entity';
import { Video } from './course/video/entities/video.entity';
import { CourseRegistrationModule } from './course/course_registration/course_registration.module';
import { CourseRegistration } from './course/course_registration/entities/course_registration.entity';
import { AttendanceModule } from './attendance/attendance.module';
import { Attendance } from './attendance/entities/attendance.entity';

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
                    Project,ProjectDoc, ProjectRegistration, Feedback, Course, DocName, CourseDoc, VideoTopic, CourseRegistration, Video, Attendance],
                synchronize: true,
            }),
        }),
        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, '..', 'public'),
        // }),
        MulterModule.register({
            dest: './uploads',
        }),
        UsersModule,ExhibitionsDocModule,ExhibitionsMemberModule, ProjectsModule, ProjectDocModule, ProjectRegistrationModule, FeedbackModule,
        CoursesModule,ExhibitionIntroModule,ExhibitionModule,
        DocNameModule,
        CourseDocModule,
        VideoTopicModule,
        VideoModule,
        AuthModule,
        CourseRegistrationModule,
        AttendanceModule,
    ],
})
export class AppModule {}
