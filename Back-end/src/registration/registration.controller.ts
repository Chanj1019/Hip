import { Controller, Get, Post, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('registration')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Post()
    @Roles('admin')
    create(@Body() createRegistrationDto: CreateRegistrationDto) {
        return this.registrationService.create(createRegistrationDto);
    }

    @Get()
    findAll() {
        return this.registrationService.findAll();
    }

    // @Get(':id')
    // findOne(@Param('id') id: number) {
    //     return this.registrationService.findOne(id);
    // }

    @Delete(':id')
    @Roles('admin')
    remove(@Param('id') id: number) {
        return this.registrationService.remove(id);
    }
}
