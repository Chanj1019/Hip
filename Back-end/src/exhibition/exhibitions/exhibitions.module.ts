import { forwardRef, Module } from '@nestjs/common';
import { ExhibitionService } from './exhibitions.service';
import { ExhibitionController } from './exhibitions.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Exhibition } from './exhibition.entity';
import { RolesGuard } from '../../auth/roles.guard';
import { UsersModule } from '../../user/users.module';
@Module({
    imports: [
        TypeOrmModule.forFeature([Exhibition]),
        forwardRef(() => UsersModule)
    ],
    providers: [ExhibitionService,RolesGuard],
    controllers: [ExhibitionController],
    exports: [ExhibitionService],
})
export class ExhibitionModule {}
