import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ProjectDoc } from '../project_doc/entities/project_doc.entity'; // project_doc 엔티티 경로에 맞게 수정
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(Feedback)
        private feedbackRepository: Repository<Feedback>,
        @InjectRepository(ProjectDoc)
        private projectDocRepository: Repository<ProjectDoc>,
        @InjectRepository(Project)
        private readonly projectsRepository: Repository<Project>
    ) {}

    // 프로젝트 ID가 유효한지 확인하는 함수
    async validateProjectId(projectId: number): Promise<void> {
        const project = await this.projectsRepository.findOne({ where: { project_id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }
    }

    async create(createFeedbackDto: CreateFeedbackDto, projectId: number): Promise<Feedback> {
        await this.validateProjectId(projectId);
        const projectDoc = await this.projectDocRepository.findOne({ where: { project_doc_id: createFeedbackDto.projectDocId } });

        if (!projectDoc) {
            throw new Error('Project document not found'); // 문서가 없으면 오류 발생
        }

        const feedback = this.feedbackRepository.create({ ...createFeedbackDto, projectDoc });
        return this.feedbackRepository.save(feedback);
    }

    async update(id: number, updateFeedbackDto: UpdateFeedbackDto, projectId: number): Promise<Feedback> {
        await this.validateProjectId(projectId);
        await this.feedbackRepository.update(id, updateFeedbackDto);
        return this.feedbackRepository.findOne({ where: { id } });
    }

    async findAll(projectId: number): Promise<Feedback[]> {
        await this.validateProjectId(projectId);
        return this.feedbackRepository.find({ relations: ['projectDoc'] });
    }

    async findOne(id: number, projectId: number): Promise<Feedback> {
        await this.validateProjectId(projectId);
        return this.feedbackRepository.findOne({ where: { id }, relations: ['projectDoc'] });
    }

    async remove(id: number, projectId: number): Promise<void> {
        await this.validateProjectId(projectId);
        await this.feedbackRepository.delete(id);
    }
}
