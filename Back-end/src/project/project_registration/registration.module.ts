import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRegistrationController } from './registration.controller';
import { ProjectRegistrationService } from './registration.service';
import { ProjectRegistration } from './entities/registration.entity';
import { Project } from '../projects/entities/project.entity';
import { User } from 'src/user/user.entity';
import { UsersModule } from 'src/user/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ProjectRegistration, Project, User]),
        forwardRef(() => UsersModule),
    ],
    controllers: [ProjectRegistrationController],
    providers: [ProjectRegistrationService],
    exports: [ProjectRegistrationService],
})
export class ProjectRegistrationModule {}