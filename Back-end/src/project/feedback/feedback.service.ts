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

    // 프로젝트 ID, DocID가 유효한지 확인
    async validateProjectAndDocId(projectId: number, projectDocId: number): Promise<void> {
        const project = await this.projectsRepository.findOne({ where: { project_id: projectId } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }

        const projectDoc = await this.projectDocRepository.findOne({ where: { project_doc_id: projectDocId } });
        if (!projectDoc) {
            throw new NotFoundException(`Project Document with ID ${projectDocId} not found`);
        }
    }

    async create(createFeedbackDto: CreateFeedbackDto, projectId: number, projectDocId: number): Promise<Feedback> {
        await this.validateProjectAndDocId(projectId, projectDocId);
        
        const projectDoc = await this.projectDocRepository.findOne({ where: { project_doc_id: createFeedbackDto.projectDocId } });
        if (!projectDoc) {
            throw new Error('Project document not found');
        }

        const feedback = this.feedbackRepository.create({ ...createFeedbackDto });
        return this.feedbackRepository.save(feedback);
    }

    async update(id: number, updateFeedbackDto: UpdateFeedbackDto, projectId: number, projectDocId: number): Promise<Feedback> {
        await this.validateProjectAndDocId(projectId, projectDocId);
        
        await this.feedbackRepository.update(id, updateFeedbackDto);
        return this.feedbackRepository.findOne({ where: { id } });
    }

    async findAll(projectId: number, projectDocId: number): Promise<Feedback[]> {
        await this.validateProjectAndDocId(projectId, projectDocId);
        return this.feedbackRepository.find({ relations: ['projectDoc'] });
    }

    async findOne(id: number, projectId: number, projectDocId: number): Promise<Feedback> {
        await this.validateProjectAndDocId(projectId, projectDocId);
        return this.feedbackRepository.findOne({ where: { id }, relations: ['projectDoc'] });
    }

    async remove(id: number, projectId: number, projectDocId: number): Promise<void> {
        await this.validateProjectAndDocId(projectId, projectDocId);
        await this.feedbackRepository.delete(id);
    }
}
