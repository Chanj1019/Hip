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
    ) {}

    async create(courseTitle: string, topicTitle: string, createDocNameDto: CreateDocNameDto): Promise<DocName> {
      const docName = this.docNameRepository.create({ 
          course_title: courseTitle, 
          topic_title: topicTitle, 
          ...createDocNameDto 
      });
      return await this.docNameRepository.save(docName);
  }
  

    async findAll(topicTitle: string): Promise<DocName[]> {
        return await this.docNameRepository.find({ where: { topic_title: topicTitle }, relations: ['courseDoc'] });
    }

    async update(topicTitle: string, id: number, updateDocNameDto: UpdateDocNameDto): Promise<DocName> {
      await this.docNameRepository.update({ topic_id: id, topic_title: topicTitle }, updateDocNameDto);
      return this.findOne(topicTitle);
    }

    async remove(topicTitle: string): Promise<void> {
      const docName = await this.findOne(topicTitle);
      await this.docNameRepository.remove(docName);
    }

    async findOne(topicTitle: string): Promise<DocName> {
      const docName = await this.docNameRepository.findOne({ 
          where: { topic_title: topicTitle },
          relations: ['courseDoc']
      });
      if (!docName) {
          throw new NotFoundException(`DocName with title ${topicTitle} not found`);
      }
      return docName;
    }
    
    // async getOne(topicTitle: string): Promise<DocName> {
    //   const docName = await this.docNameRepository.findOne({
    //       where: { topic_title: topicTitle },
    //       relations: ['courseDoc']
    //   });
      
    //   if (!docName) {
    //       throw new NotFoundException(`DocName not found for course title: ${topicTitle}`);
    //   }
      
    //   return docName; // docName을 반환
    // }
  
}
