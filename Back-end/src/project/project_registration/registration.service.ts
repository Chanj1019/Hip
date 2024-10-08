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

    // 이미 참가 신청이 되어 있는지 확인하는 함수
    async isEnrolled(projectId: number, userId: number): Promise<boolean> {
        const existingEnrollment = await this.projectRegistrationRepository.findOne({
            where: {
                project: { project_id: projectId }, // 프로젝트 ID로 필터링
                user: { user_id: userId }, // 사용자 ID로 필터링
            },
        });

        return !!existingEnrollment; // 이미 존재하면 true, 없으면 false
    }

    // 참가 신청 하기
    async create(createProjectRegistrationDto: CreateProjectRegistrationDto, projectId: number, loginedUser: number): Promise<ProjectRegistration> {
        // 이미 해당 프로젝트에 참가 신청이 되어 있을 때
        const isAlreadyEnrolled = await this.isEnrolled(projectId, loginedUser);
        if(isAlreadyEnrolled) {
            throw new ConflictException('이미 신청된 프로젝트입니다.');
        }
    
        // 처음 참가 신청
        const projectRegistration = this.projectRegistrationRepository.create(createProjectRegistrationDto);
        projectRegistration.user = await this.userRepository.findOneBy({ user_id: loginedUser });  // 특정 사용자와 연결된 정보
        projectRegistration.project = await this.projectsRepository.findOneBy({ project_id: projectId });  // 특정 프로젝트와 연결된 정보
        return await this.projectRegistrationRepository.save(projectRegistration);
    }
    
    // user 참고하여 user_name과 id를 함께 반환
    async findAll(): Promise<{ projectRegistration: ProjectRegistration; userName: string; userId: string, projectTopic: string }[]> {
        const info = await this.projectRegistrationRepository.find({ relations: ['user', 'project'] });  // 각 등록에 대한 사용자와 프로젝트 정보
        return info.map(registration => ({
            projectRegistration: registration,
            userName: registration.user.user_name,
            userId: registration.user.id,
            projectTopic: registration.project.topic,
        }));
    }

    async findOne(id: number): Promise<ProjectRegistration> {
        const registration = await this.projectRegistrationRepository.findOne({ where: { project_registration_id: id } });
        this.handleNotFound(registration, id);
        return registration;
    }

    async update(id: number, updateProjectRegistrationDto: UpdateProjectRegistrationDto): Promise<ProjectRegistration> {
        const registration = await this.projectRegistrationRepository.findOne({ where: { project_registration_id: id } });
        this.handleNotFound(registration, id);

        Object.assign(registration, updateProjectRegistrationDto);
        return await this.projectRegistrationRepository.save(registration);
    }    

    async remove(id: number): Promise<void> {
        const registration = await this.projectRegistrationRepository.findOne({ where: { project_registration_id: id } });
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