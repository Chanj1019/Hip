import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRegistrationController } from './registration.controller';
import { ProjectRegistrationService } from './registration.service';
import { ProjectRegistration } from './entities/registration.entity';

@Module({
    imports: [TypeOrmModule.forFeature([ProjectRegistration])],
    controllers: [ProjectRegistrationController],
    providers: [ProjectRegistrationService],
})
export class ProjectRegistrationModule {}
