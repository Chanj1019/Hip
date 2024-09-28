import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectRegistration } from './entities/registration.entity';
import { CreateProjectRegistrationDto } from './dto/create-registration.dto';
import  { User } from '../../user/user.entity';
import { Project } from '../../project/projects/entities/project.entity';
import { ConflictException } from '@nestjs/common';
import { UpdateProjectRegistrationDto } from './dto/update-registration.dto';

@Injectable()
export class ProjectRegistrationService {
    constructor(
        @InjectRepository(ProjectRegistration)
        private readonly projectRegistrationRepository: Repository<ProjectRegistration>,
        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
    ) {}

    // async create(createRegistrationDto: CreateProjectRegistrationDto): Promise<ProjectRegistration> {
    //     // 이미 해당 프로젝트에 참가 신청이 되어 있는지 확인
    //     const existingRegistration = await this.projectRegistrationRepository.findOne({
    //         where: { userId: createRegistrationDto.userId, projectTopic: createRegistrationDto.projectTopic }
    //     });
    
    //     if (existingRegistration) {
    //         throw new ConflictException('이미 신청된 프로젝트입니다.');
    //     }
    
    //     const registration = this.projectRegistrationRepository.create(createRegistrationDto);
    //     return this.projectRegistrationRepository.save(registration);
    // }

    async create(createProjectRegistrationDto: CreateProjectRegistrationDto): Promise<ProjectRegistration> {
        // 이미 해당 프로젝트에 참가 신청이 되어 있는지 확인
        const projectId = createProjectRegistrationDto.projectId;
        const existingProject = await this.projectsRepository.findOne({ where: { project_id: projectId } });
        const userId = createProjectRegistrationDto.userId;
        const existingUser = await this.userRepository.findOne({ where: { user_id: userId } });
    
        const existingProjectRegistration = await this.projectRegistrationRepository.findOne({
            where: {
                user: existingUser,
                project: existingProject,
            },
        });
    
        if (existingProjectRegistration) {
            throw new ConflictException('이미 신청된 프로젝트입니다.');
        }
    
        // 처음 참가 신청
        const projectRegistration = this.projectRegistrationRepository.create(createProjectRegistrationDto);
        return await this.projectRegistrationRepository.save(projectRegistration);
    }    
    
    // user 참고하여 user_name과 id를 함께 반환
    async findAll(): Promise<{ registration: ProjectRegistration; userName: string; userId: number }[]> {
        const registrations = await this.projectRegistrationRepository
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
            userId: registration.userId,
        }));
    }    
    

    async findOne(id: number): Promise<ProjectRegistration> {
        const registration = await this.projectRegistrationRepository.findOne({ where: { registration_id: id } });
        this.handleNotFound(registration, id);
        return registration;
    }

    async update(id: number, updateProjectRegistrationDto: UpdateProjectRegistrationDto): Promise<ProjectRegistration> {
        const registration = await this.projectRegistrationRepository.findOne({ where: { registration_id: id } });
        this.handleNotFound(registration, id);

        Object.assign(registration, updateProjectRegistrationDto);
        return await this.projectRegistrationRepository.save(registration);
    }    

    async remove(id: number): Promise<void> {
        const registration = await this.projectRegistrationRepository.findOne({ where: { registration_id: id } });
        this.handleNotFound(registration, id);
        await this.projectRegistrationRepository.delete(id);
    }

    // 예외 처리
    private handleNotFound(registration: ProjectRegistration, id: number): void {
        if (!registration) {
            throw new NotFoundException(`Registration with ID ${id} not found`);
        }
    }
}