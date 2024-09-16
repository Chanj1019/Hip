import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from './entities/project.entity';
import { UsersService } from 'src/user/users.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';


@Injectable()
export class ProjectsService {
    constructor(
        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>
    ) {}


    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const { team_name, title } = createProjectDto;

        // team_name이 중복되는지 확인
        const existingteam = await this.projectsRepository.findOne({ where: { team_name } });

        if (existingteam) {
            throw new ConflictException(`${team_name}팀은(는) 이미 존재합니다.`);
        }

        // title이 중복되는지 확인
        const existingtitle = await this.projectsRepository.findOne({ where: { title } });

        if (existingtitle) {
            throw new ConflictException(`topic은(는) 이미 존재합니다.`);
        }

        const project = this.projectsRepository.create(createProjectDto);
        return this.projectsRepository.save(project);
    }

    async findAll(): Promise<Project[]> {
        return this.projectsRepository.find();
    }

    async findOne(id: number): Promise<Project> {
        const project = await this.projectsRepository.findOne({ where: { project_id: id } });
        if (!project) {
            throw new NotFoundException(`ID가 ${id}인 프로젝트를 찾을 수 없습니다.`);
        }
        return project;
    }

    async update(id: number, updateProjectDto: UpdateProjectDto): Promise<Project> {
        const { team_name, title } = updateProjectDto;

        // 업데이트할 프로젝트를 찾습니다.
        const project = await this.findOne(id);

        // 팀 이름 중복 확인 (현재 프로젝트를 제외하고)
        if (team_name) {
            const existingTeam = await this.projectsRepository.findOne({
                where: { team_name },
            });
            if (existingTeam && existingTeam.project_id !== id) {
                throw new ConflictException(`${team_name}팀은(는) 이미 존재합니다.`);
            }
        }

        // 타이틀 중복 확인 (현재 프로젝트를 제외하고)
        if (title) {
            const existingTitle = await this.projectsRepository.findOne({
                where: { title },
            });
            if (existingTitle && existingTitle.project_id !== id) {
                throw new ConflictException(`프로젝트 topic이(가) 이미 존재합니다.`);
            }
        }
        
        Object.assign(project, updateProjectDto);
        return this.projectsRepository.save(project);
    }

    async remove(id: number): Promise<void> {
        const project = await this.findOne(id);
        await this.projectsRepository.remove(project);
    }
}
