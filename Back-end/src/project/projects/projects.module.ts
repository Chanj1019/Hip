import { Module, forwardRef } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { ProjectsService } from './projects.service';
import { ProjectsController } from './projects.controller';
import { User } from '../../user/user.entity';
import { UsersModule } from '../../user/users.module'; // UsersModule 임포트
import { UsersService } from '../../user/users.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([Project, User]), // Project와 User 엔티티를 포함
        forwardRef(() => UsersModule), // UsersModule을 forwardRef로 임포트
    ],
    providers: [ProjectsService, UsersService],
    controllers: [ProjectsController],
    exports: [ProjectsService],
})
export class ProjectsModule {}