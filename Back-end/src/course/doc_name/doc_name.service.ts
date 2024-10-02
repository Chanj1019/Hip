import { Injectable, NotFoundException } from '@nestjs/common';
import { DocName } from './entities/doc_name.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class DocNameService {
    constructor(
        @InjectRepository(DocName)
        private docNameRepository: Repository<DocName>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async create(
        courseId: number, 
        createDocNameDto: CreateDocNameDto
    ): Promise<DocName> {
        const course = await this.courseRepository.findOne({ 
            where: { course_id: courseId }
        });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const docName = this.docNameRepository.create({
            ...createDocNameDto 
        });
        return await this.docNameRepository.save(docName);
    }

    async findAll(
        courseId: number, 
    ): Promise<DocName[]> {
        const course = await this.courseRepository.findOne({ 
            where: { course_id: courseId }
        });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        return await this.docNameRepository.find();
    }

    async update(
        courseId: number, 
        topicTitle: string, 
        updateDocNameDto: UpdateDocNameDto
    ): Promise<DocName> {
        const docName = await this.findOne(courseId, topicTitle);
        await this.docNameRepository.update(docName.topic_id, updateDocNameDto);
        const newTopicTitle = updateDocNameDto.topic_title || topicTitle
        return this.findOne(courseId, newTopicTitle);
    }

    async remove(
        courseId: number, 
        topicTitle: string
    ): Promise<void> {
        const docName = await this.findOne(courseId, topicTitle);
        await this.docNameRepository.remove(docName);
    }

    async findOne(
        courseId: number, 
        topicTitle: string
    ): Promise<DocName> {
        const course = await this.courseRepository.findOne({
            where: { course_id: courseId }
        });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const docName = await this.docNameRepository.findOne({ 
            where: { topic_title: topicTitle },
            relations: ['courseDocs']
        });
        if (!docName) {
            throw new NotFoundException(`DocName with title ${topicTitle} not found`);
        }
        return docName;
    }
}