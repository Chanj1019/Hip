import { Controller, Get, Post, Delete, Param, Body } from '@nestjs/common';
import { RegistrationService } from './registration.service';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Controller('registration')
export class RegistrationController {
    constructor(private readonly registrationService: RegistrationService) {}

    @Post()
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
    remove(@Param('id') id: number) {
        return this.registrationService.remove(id);
    }
}
