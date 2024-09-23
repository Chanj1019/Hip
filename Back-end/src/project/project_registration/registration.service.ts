import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectRegistration } from './entities/registration.entity';
import { CreateProjectRegistrationDto } from './dto/create-registration.dto';

@Injectable()
export class ProjectRegistrationService {
    constructor(
        @InjectRepository(ProjectRegistration)
        private readonly registrationRepository: Repository<ProjectRegistration>,
    ) {}

    async create(createRegistrationDto: CreateProjectRegistrationDto): Promise<ProjectRegistration> {
        const registration = this.registrationRepository.create(createRegistrationDto);
        return this.registrationRepository.save(registration);
    }

    // user 참고하여 user_name과 id를 함께 반환
    async findAll(): Promise<{ registration: ProjectRegistration; userName: string; userId: string }[]> {
        const registrations = await this.registrationRepository
            .createQueryBuilder('registration')
            .leftJoinAndSelect('registration.user', 'user')
            .select([
                'registration',
                'user.user_name',
                'user.id',
            ])
            .getMany();
    
        return registrations.map(registration => ({
            registration,
            userName: registration.user.user_name,
            userId: registration.user.id,
        }));
    }    
    

    async findOne(id: number): Promise<ProjectRegistration> {
        const registration = await this.registrationRepository.findOne({ where: { registration_id: id } });
        this.handleNotFound(registration, id);
        return registration;
    }

    async remove(id: number): Promise<void> {
        const registration = await this.registrationRepository.findOne({ where: { registration_id: id } });
        this.handleNotFound(registration, id);
        await this.registrationRepository.delete(id);
    }

    // 예외 처리
    private handleNotFound(registration: ProjectRegistration, id: number): void {
        if (!registration) {
            throw new NotFoundException(`Registration with ID ${id} not found`);
        }
    }
}