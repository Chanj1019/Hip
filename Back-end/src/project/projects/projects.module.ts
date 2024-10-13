import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { User } from '../../user/user.entity';
import { UsersModule } from '../../user/users.module'; // UsersModule 임포트
import { UsersService } from '../../user/users.service';
import { ProjectRegistrationModule } from '../project_registration/registration.module';
import { ProjectRegistrationService } from '../project_registration/registration.service';
import { ProjectRegistration } from '../project_registration/entities/registration.entity';
import { FeedbackModule } from '../feedback/feedback.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project, User, ProjectRegistration]),
        forwardRef(() => UsersModule),forwardRef(() => FeedbackModule), ProjectRegistrationModule,
    ],
    providers: [ProjectsService, UsersService, ProjectRegistrationService],
    controllers: [ProjectsController],
    exports: [ProjectsService],
})
export class ProjectsModule {}