import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Feedback } from './entities/feedback.entity';
import { CreateFeedbackDto } from './dto/create-feedback.dto';
import { UpdateFeedbackDto } from './dto/update-feedback.dto';
import { Project_doc } from '../project_doc/entities/project_doc.entity'; // project_doc 엔티티 경로에 맞게 수정

@Injectable()
export class FeedbackService {
    constructor(
        @InjectRepository(Feedback)
        private feedbackRepository: Repository<Feedback>,
        @InjectRepository(Project_doc)
        private projectDocRepository: Repository<Project_doc>,
    ) {}

    async create(createFeedbackDto: CreateFeedbackDto): Promise<Feedback> {
        const projectDoc = await this.projectDocRepository.findOne({ where: { project_doc_id: createFeedbackDto.projectDocId } });

        if (!projectDoc) {
            throw new Error('Project document not found'); // 문서가 없으면 오류 발생
        }

        const feedback = this.feedbackRepository.create({ ...createFeedbackDto, projectDoc });
        return this.feedbackRepository.save(feedback);
    }

    async update(id: number, updateFeedbackDto: UpdateFeedbackDto): Promise<Feedback> {
        await this.feedbackRepository.update(id, updateFeedbackDto);
        return this.feedbackRepository.findOne({ where: { id } });
    }

    async findAll(): Promise<Feedback[]> {
        return this.feedbackRepository.find({ relations: ['projectDoc'] });
    }

    async findOne(id: number): Promise<Feedback> {
        return this.feedbackRepository.findOne({ where: { id }, relations: ['projectDoc'] });
    }

    async remove(id: number): Promise<void> {
        await this.feedbackRepository.delete(id);
    }
}
