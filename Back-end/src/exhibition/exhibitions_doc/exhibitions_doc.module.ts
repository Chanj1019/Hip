import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ExhibitionsDocController } from './exhibitions_doc.controller';
import { ExhibitionsDocService } from './exhibitions_doc.service';
import { ExhibitionDoc } from './entities/exhibition_doc.entity';
import { Exhibition } from '../exhibitions/exhibition.entity';
import { UsersModule } from '../../user/users.module';

@Module({
    imports: [
        TypeOrmModule.forFeature([ExhibitionDoc, Exhibition]),
        forwardRef(() => UsersModule),
    ],
    controllers: [ExhibitionsDocController],
    providers: [ExhibitionsDocService],
    exports: [ExhibitionsDocService],
})
export class ExhibitionsDocModule {}
