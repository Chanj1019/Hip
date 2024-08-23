import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateDocNameDto } from './dto/create-doc_name.dto';
import { UpdateDocNameDto } from './dto/update-doc_name.dto';
import { DocName } from './entities/doc_name.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class DocNameService {
  constructor(
    @InjectRepository(DocName)
    private docnameRepository: Repository<DocName>,
  ) {}

  async create(createDocNameDto: CreateDocNameDto): Promise<DocName> {
    const newDocName = this.docnameRepository.create(createDocNameDto);
    return await this.docnameRepository.save(newDocName);
  }

  async findAll(): Promise<DocName[]> {
    return await this.docnameRepository.find({ relations: ['subTopics'] }); // 소주제를 포함하여 조회
  }

  async findOne(id: number): Promise<DocName> {
    const docName = await this.docnameRepository.findOne({ where: { id }, relations: ['subTopics'] });
    if (!docName) {
      throw new NotFoundException(`DocName with ID ${id} not found`);
    }
    return docName;
  }

  async update(id: number, updateDocNameDto: UpdateDocNameDto): Promise<DocName> {
    const docName = await this.findOne(id);
    Object.assign(docName, updateDocNameDto);
    return await this.docnameRepository.save(docName);
  }

  async removeSubTopic(subTopicId: number): Promise<void> {
    const result = await this.docnameRepository.delete(subTopicId);
    if (result.affected === 0) {
      throw new NotFoundException(`SubTopic with ID ${subTopicId} not found`);
    }
  }

  async remove(id: number): Promise<void> {
    const docName = await this.findOne(id);

    // 소주제 삭제
    await this.docnameRepository.delete({ pa_topic_id: id }); // parentId가 맞는지 확인 필요

    // 주제 삭제
    const result = await this.docnameRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`DocName with ID ${id} not found`);
    }
  }
}
