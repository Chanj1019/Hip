import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { ExhibitionModule } from './exhibitions/exhibitions.module';
import { Exhibition } from './exhibitions/exhibition.entity';
import { ExhibitionDoc } from './exhibitions_doc/entities/exhibition_doc.entity';
import { ExhibitionsDocModule } from './exhibitions_doc/exhibitions_doc.module';
import { ExhibitionMember } from './exhibitions_member/entities/exhibition_member.entity';
import { ExhibitionsMemberModule } from './exhibitions_member/exhibitions_member.module';
import { ExhibitionIntroModule } from './exhibition_intro/exhibition_intro.module';
import { ExhibitionIntro } from './exhibition_intro/entities/exhibition_intro.entity';
import { AuthModule } from './auth/auth.module';

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
import { RegistrationController } from './registration/registration.controller';
import { RegistrationService } from './registration/registration.service';
import { RegistrationModule } from './registration/registration.module';
import { Registration } from './registration/entities/registration.entity';
import { FeedbackModule } from './feedback/feedback.module';
import { Feedback } from './feedback/entities/feedback.entity';


@Module({
    imports: [
        AuthModule,UsersModule,
        ConfigModule.forRoot(), // ConfigModule 추가
        TypeOrmModule.forRootAsync({
            useFactory: () => ({
                type: process.env.DB_TYPE as 'mysql',
                host: process.env.DB_HOST,
                port: parseInt(process.env.DB_PORT, 10),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_DATABASE,

                entities: [User,Exhibition,ExhibitionDoc,ExhibitionMember,ExhibitionIntro , Project,Project_doc, Registration, Feedback],
                synchronize: true,
            }),
        }),
        UsersModule,ExhibitionsDocModule,ExhibitionsMemberModule, ProjectsModule, ProjectDocModule, RegistrationModule, FeedbackModule,
        ExhibitionModule,
        ExhibitionIntroModule,
        AuthModule, 
    ],
    controllers: [RegistrationController],
    providers: [RegistrationService],
})
export class AppModule {}
