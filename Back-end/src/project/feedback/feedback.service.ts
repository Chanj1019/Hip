import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { ProjectDocTitle } from '../project_doc_title/entities/project_doc_title.entity'; // project_doc 엔티티 경로에 맞게 수정
import { Project } from '../projects/entities/project.entity';

@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(Feedback)
        private feedbackRepository: Repository<Feedback>,
        @InjectRepository(ProjectDocTitle)
        private projectDocRepository: Repository<ProjectDocTitle>,
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

        const feedback = this.feedbackRepository.create({ ...createFeedbackDto });
        return this.feedbackRepository.save(feedback);
    }

    async findAll(projectId: number, projectDocId: number): Promise<Feedback[]> {
        await this.validateProjectAndDocId(projectId, projectDocId);
        return this.feedbackRepository.find({ relations: ['projectDoc'] });
    }

    async findOne(id: number, projectId: number, projectDocId: number): Promise<Feedback> {
        await this.validateProjectAndDocId(projectId, projectDocId);
        const feedback = this.feedbackRepository.findOne({ where: { feedback_id: id }, relations: ['projectDoc'] });
        if(!feedback) {
            throw new NotFoundException(`Feedback with ID ${id} not found`)
        }
        return feedback;
    }

    async update(id: number, updateFeedbackDto: UpdateFeedbackDto, projectId: number, projectDocId: number): Promise<Feedback> {
        const feedback = await this.findOne(id,projectId, projectDocId);

        Object.assign(feedback, updateFeedbackDto);
        return await this.feedbackRepository.save(feedback);
    }

    async remove(id: number, projectId: number, projectDocId: number): Promise<void> {
        await this.findOne(id,projectId, projectDocId);
        await this.feedbackRepository.delete(id);
    }

    async findById(id: number): Promise<Feedback> {
        if (id <= 0) {
            throw new BadRequestException('유효하지 않은 ID입니다.');
        }
  
        const feedback = await this.feedbackRepository.findOne({
        where: { feedback_id: id },
        relations: ['project', 'projectDoc'],
        });
  
        if (!feedback) {
            throw new NotFoundException('자료를 찾을 수 없습니다.');
        }
  
        return feedback;
    }
}
