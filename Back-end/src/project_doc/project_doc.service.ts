import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project_doc } from './entities/project_doc.entity';
import { CreateProjectDocDto } from './dto/create-project_doc.dto';
import { UpdateProjectDocDto } from './dto/update-project_doc.dto';

@Injectable()
export class ProjectDocService {
    constructor(
        @InjectRepository(Project_doc)
        private readonly projectDocRepository: Repository<Project_doc>,
    ) {}

    async create(createProjectDocDto: CreateProjectDocDto): Promise<Project_doc> {
        const projectDoc = this.projectDocRepository.create(createProjectDocDto);
        return await this.projectDocRepository.save(projectDoc);
    }

    async findAll(): Promise<Project_doc[]> {
        return await this.projectDocRepository.find({ relations: ['project'] });
    }

    async findOne(id: number): Promise<Project_doc> {
        return await this.projectDocRepository.findOne({
            where: { project_doc_id: id },
            relations: ['project'],
        });
    }

    async update(id: number, updateProjectDocDto: UpdateProjectDocDto): Promise<Project_doc> {
        await this.projectDocRepository.update(id, updateProjectDocDto);
        return await this.findOne(id);
    }

    async remove(id: number): Promise<void> {
        await this.projectDocRepository.delete(id);
    }
}
