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
import { ExhibitionModule } from './exhibitions/exhibitions.module';
import { Exhibition } from './exhibitions/exhibition.entity';
import { ExhibitionDocModule } from './exhibition_doc/exhibition_doc.module';
import { ExhibitionMemberModule } from './exhibition_member/exhibition_member.module';
import { ExhibitionsMemberModule } from './exhibitions_member/exhibitions_member.module';
import { ExhibitionsDocModule } from './exhibitions_doc/exhibitions_doc.module';

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
                entities: [User,Exhibition],
                synchronize: true,
            }),
        }),
        UsersModule,       
        ExhibitionModule, ExhibitionDocModule, ExhibitionMemberModule, ExhibitionsMemberModule, ExhibitionsDocModule,
    ],
})
export class AppModule {}
