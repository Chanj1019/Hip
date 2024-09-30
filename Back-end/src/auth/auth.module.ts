import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../user/user.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './roles.guard';
import { UsersModule } from '../user/users.module';
import { OwnershipGuard } from './ownership.guard';
import { CoursesModule } from '../course/courses/courses.module';
import { ProjectsModule } from '../project/projects/projects.module';
import { ExhibitionModule } from '../exhibition/exhibitions/exhibitions.module';
@Global()
@Module({
    imports: [
        UsersModule,CoursesModule,ProjectsModule,ExhibitionModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        RolesGuard,
        OwnershipGuard
    ],
    controllers: [AuthController],
    exports: [AuthService,RolesGuard,OwnershipGuard],
})
export class AuthModule {}
