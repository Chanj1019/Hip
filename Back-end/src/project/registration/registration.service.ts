import { Injectable } from '@nestjs/common';
import { CreateRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class RegistrationService {
    private registrations = [];

    create(createRegistrationDto: CreateRegistrationDto) {
        const newRegistration = { id: Date.now(), ...createRegistrationDto };
        this.registrations.push(newRegistration);
        return newRegistration;
    }

    findAll() {
        return this.registrations;
    }

    findOne(id: number) {
        return this.registrations.find(reg => reg.id === id);
    }

    remove(id: number) {
        this.registrations = this.registrations.filter(reg => reg.id !== id);
        return { deleted: true };
    }
}
