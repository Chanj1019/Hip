// import { Module } from '@nestjs/common';
// import { TypeOrmModule } from '@nestjs/typeorm';
// import { UsersModule } from './users/users.module';
// import { User } from './users/user.entity';
// import { MaterialModule } from './material/material.module';

// @Module({
//     imports: [
//         TypeOrmModule.forRoot({
//
//         }),
//         UsersModule,
//         MaterialModule,
//     ],
// })
// export class AppModule {}

//>>>>>>>> .env 파일을 만들어 Db정보 저장후 은닉

import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './users/users.module';
import { User } from './users/user.entity';
import { Course } from './courses/course.entity';
import { MaterialModule } from './material/material.module';
import { CoursesModule } from './courses/courses.module';

@Module({
  imports: [
    ConfigModule.forRoot(), // ConfigModule 추가
    TypeOrmModule.forRootAsync({
        imports: [ConfigModule],
        useFactory: () => ({
            type: 'mysql',
            host: process.env.DB_HOST,
            port: parseInt(process.env.DB_PORT, 10),
            username: process.env.DB_USERNAME,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
            entities: [User, Course],
            synchronize: true,
        }),
    }),
    UsersModule,
    MaterialModule,
    CoursesModule,
  ],
})
export class AppModule {}
