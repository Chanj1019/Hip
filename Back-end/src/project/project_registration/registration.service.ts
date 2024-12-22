import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Unique } from 'typeorm';
import { ProjectRegistration } from './entities/registration.entity';
import { CreateProjectRegistrationDto } from './dto/create-registration.dto';
import  { User } from '../../user/user.entity';
import { Project } from '../../project/projects/entities/project.entity';
import { ConflictException } from '@nestjs/common';
import { UpdateProjectRegistrationDto } from './dto/update-registration.dto';

// @Unique(['user', 'project']) // user와 project가 중복되지 않도록 설정
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

    // 프로젝트 ID가 유효한지 확인하는 함수
    async validateProjectId(projectId: number): Promise<void> {
        const project = await this.projectsRepository.findOne({ where: { project_id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }
    }

    // 참가 신청 하기
    async create(createProjectRegistrationDto: CreateProjectRegistrationDto, projectId: number, loginedUser: number): Promise<ProjectRegistration> {
        await this.validateProjectId(projectId);

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
    async findAll(projectId: number): Promise<{ projectRegistration: ProjectRegistration; userName: string; userId: string, projectTopic: string }[]> {
        await this.validateProjectId(projectId);
        const info = await this.projectRegistrationRepository.find(
            { 
                relations: ['user', 'project']
            }
        );  // 각 등록에 대한 사용자와 프로젝트 정보
        return info.map(registration => ({
            projectRegistration: registration,
            userName: registration.user.user_name,
            userId: registration.user.id,
            projectTopic: registration.project.topic,
        }));
    }

    async findOne(id: number, projectId: number): Promise<ProjectRegistration> {
        await this.validateProjectId(projectId);
    
        const registration = await this.projectRegistrationRepository.findOne({ where: { project_registration_id: id } });
        if (!registration) {
            throw new NotFoundException(`Registration with ID ${id} not found`);
        }
        return registration;
    }    

    async update(id: number, updateProjectRegistrationDto: UpdateProjectRegistrationDto, projectId: number): Promise<ProjectRegistration> {
        const registration = await this.findOne(id, projectId); 
        
        Object.assign(registration, updateProjectRegistrationDto);
        return await this.projectRegistrationRepository.save(registration);
    }


    async remove(id: number, projectId: number): Promise<void> {
        await this.findOne(id, projectId);
        
        await this.projectRegistrationRepository.delete(id);
    }
}