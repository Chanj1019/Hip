import { Injectable, NotFoundException } from '@nestjs/common';
import { DocName } from './entities/doc_name.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';

@Injectable()
export class DocNameService {
  constructor(
      @InjectRepository(DocName)
      private docNameRepository: Repository<DocName>,
  ) {}

  async create(courseTitle: string, createDocNameDto: CreateDocNameDto): Promise<DocName> {
      const docName = this.docNameRepository.create({ 
          course_title: courseTitle,
          ...createDocNameDto 
      });
      return await this.docNameRepository.save(docName);
  }
  
  async findAll(): Promise<DocName[]> {
      return await this.docNameRepository.find();
  }

  async update(topicTitle: string, updateDocNameDto: UpdateDocNameDto): Promise<DocName> {
      const docName = await this.findOne(topicTitle);
      await this.docNameRepository.update(docName.topic_id, updateDocNameDto);
      const newTopicTitle = updateDocNameDto.topic_title || topicTitle
      return this.findOne(newTopicTitle);
  }

  async remove(topicTitle: string): Promise<void> {
      const docName = await this.findOne(topicTitle);
      await this.docNameRepository.remove(docName);
  }

  async findOne(topicTitle: string): Promise<DocName> {
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