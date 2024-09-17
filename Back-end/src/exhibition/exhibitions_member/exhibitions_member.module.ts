import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { Exhibition } from 'src/exhibition/exhibitions/exhibition.entity';
import { ExhibitionService } from 'src/exhibition/exhibitions/exhibitions.service';
import { ExhibitionsMemberController } from './exhibitions_member.controller';
import { UsersModule } from '../../user/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExhibitionMember, Exhibition]),
        UsersModule,
    ],
    providers: [ExhibitionsMemberService,ExhibitionService],
    exports: [ExhibitionsMemberService],
    controllers: [ExhibitionsMemberController],
})
export class ExhibitionsMemberModule {}
