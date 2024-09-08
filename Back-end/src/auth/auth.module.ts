// import { Module, Global } from '@nestjs/common'; // Global 임포트 추가
// import { AuthService } from './auth.service';
// import { AuthController } from './auth.controller';
// import { JwtStrategy } from './jwt.strategy';
// import { User } from '../users/user.entity'; 
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { JwtModule } from '@nestjs/jwt';
// import { RolesGuard } from './roles.guard';
// import { APP_GUARD } from '@nestjs/core';
// import { UsersModule } from '../users/users.module';

// @Global() // 전역 모듈로 설정
// @Module({
//     imports: [
//         UsersModule,
//         TypeOrmModule.forFeature([User]),
//         JwtModule.register({
//             secret: process.env.JWT_SECRET,
//             signOptions: { expiresIn: '1h' },
//         }),
//     ],
//     providers: [
//         AuthService,
//         JwtStrategy,
//         {
//             provide: APP_GUARD,
//             useClass: RolesGuard, // RolesGuard를 전역 가드로 설정
//         },
//     ],
//     controllers: [AuthController],
//     exports: [AuthService], // 다른 모듈에서 AuthService를 사용할 수 있도록 export
// })
// export class AuthModule {}
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
