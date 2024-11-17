import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DocName } from './entities/doc_name.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';
import { Course } from '../courses/entities/course.entity';
import { DocNameResponseDto } from './dto/doc_name-with-coursedoc-response.dto';

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
            // DocName 엔티티 생성
        const docName = this.docNameRepository.create({
            topic_title: createDocNameDto.topic_title,
            pa_topic_id: createDocNameDto.pa_topic_id,
            course: course  // course 엔티티 전체를 할당
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

    async findDocTopic(
        courseId: number, 
        topicId: number
    ): Promise<DocNameResponseDto> {  // 반환 타입을 DTO로 변경
        const course = await this.courseRepository.findOne({
            where: { course_id: courseId }
        });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }

        // 재귀적으로 모든 하위 topic_id들을 찾는 보조 함수
        const findAllChildTopicIds = async (parentTopicId: number): Promise<number[]> => {
            const children = await this.docNameRepository.find({
                where: { pa_topic_id: parentTopicId }
            });
            
            if (!children.length) return [];

            const childIds = children.map(child => child.topic_id);
            const descendantIds = await Promise.all(
                children.map(child => findAllChildTopicIds(child.topic_id))
            );

            return [...childIds, ...descendantIds.flat()];
        };

        // 1. 먼저 요청된 topic_id에 해당하는 문서 찾기
        const docName = await this.docNameRepository.findOne({ 
            where: { topic_id: topicId },
            relations: ['courseDocs']
        });

        if (!docName) {
            throw new NotFoundException(`DocName with title ${topicId} not found`);
        }

        // 2. 모든 하위 topic_id들을 찾아서 subTopics에 포함
        const childTopicIds = await findAllChildTopicIds(topicId);
        if (childTopicIds.length > 0) {
            const childTopics = await this.docNameRepository.find({
                where: { topic_id: In(childTopicIds) },
                relations: ['courseDocs']
            });
            docName.subTopics = childTopics;
        }

        // 3. DTO로 변환하여 반환
        return new DocNameResponseDto(docName);
    }


    // pa_topic_id이 null인 topic 조회 메서드
    async findRootDocName(
        courseId: number
    ): Promise<DocName> {
        const course = await this.courseRepository.findOne({
            where: { course_id: courseId }
        });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const docnames = await this.docNameRepository.findOne({
            where : { pa_topic_id: null }
        });
        return docnames
    }
    // 특정 pa_topic_id를 갖는 topic 조회 메서드 추가 작성 필요 

  
    async findById(id: number): Promise<DocName> {
        if (id <= 0) {
            throw new BadRequestException('유효하지 않은 ID입니다.');
        }
  
        const doc = await this.docNameRepository.findOne({
        where: { topic_id: id },
        relations: ['course'],
        });
  
        if (!doc) {
            throw new NotFoundException('자료를 찾을 수 없습니다.');
        }
  
        return doc;
    }

}