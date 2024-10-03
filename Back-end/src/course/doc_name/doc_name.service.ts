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
        })
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const docName = this.docNameRepository.create({...createDocNameDto});
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
        topicId: number, 
        updateDocNameDto: UpdateDocNameDto
    ): Promise<DocName> {
        const docName = await this.findOne(courseId, topicId);
        await this.docNameRepository.update(docName.topic_id, updateDocNameDto);
        const newTopicId = topicId
        return this.findOne(courseId, newTopicId);
    }

    async remove(
        courseId: number, 
        topicId: number
    ): Promise<void> {
        const docName = await this.findOne(courseId, topicId);
        await this.docNameRepository.remove(docName);
    }

    async findOne(
        courseId: number, 
        topicId: number
    ): Promise<DocName> {
        const course = await this.courseRepository.findOne({
            where: { course_id: courseId }
        });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const docName = await this.docNameRepository.findOne({ 
            where: { topic_id: topicId },
            relations: ['courseDocs']
        });
        if (!docName) {
            throw new NotFoundException(`DocName with title ${topicId} not found`);
        }
        return docName;
    }

    // pa_topic_id이 null인 topic 조회 메서드 추가 작성 필요

    
    // 특정 pa_topic_id를 갖는 topic 조회 메서드 추가 작성 필요 
}