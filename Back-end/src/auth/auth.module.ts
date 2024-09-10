import { Global, Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './jwt.strategy';
import { User } from '../users/user.entity'; 
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { RolesGuard } from './roles.guard';
import { UsersModule } from '../users/users.module';
@Global()
@Module({
    imports: [
        UsersModule,
        TypeOrmModule.forFeature([User]),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: { expiresIn: '1h' },
        }),
    ],
    providers: [
        AuthService,
        JwtStrategy,
        RolesGuard
        
    ],
    controllers: [AuthController],
    exports: [AuthService,RolesGuard],
})
export class AuthModule {}
