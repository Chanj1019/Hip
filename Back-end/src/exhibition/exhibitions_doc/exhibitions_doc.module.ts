import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionsDocController } from './exhibitions_doc.controller';
import { ExhibitionsDocService } from './exhibitions_doc.service';
import { ExhibitionDoc } from './entities/exhibition_doc.entity';
import { Exhibition } from '../exhibitions/exhibition.entity';
import { UsersModule } from '../../user/users.module'; // UsersModule 임포트 추가

@Module({
  imports: [
    TypeOrmModule.forFeature([ExhibitionDoc, Exhibition]),
    UsersModule, // UsersModule 추가
  ],
  controllers: [ExhibitionsDocController],
  providers: [ExhibitionsDocService],
})
export class ExhibitionsDocModule {}
