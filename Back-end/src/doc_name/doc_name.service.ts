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

    async create(courseId: number, createDocNameDto: CreateDocNameDto): Promise<DocName> {
        const docName = this.docNameRepository.create({ ...createDocNameDto, course_id: courseId });
        return await this.docNameRepository.save(docName);
    }

    async findAll(courseId: number): Promise<DocName[]> {
        return await this.docNameRepository.find({ where: { course_id: courseId }, relations: ['courseDoc'] });
    }

    async update(courseId: number, id: number, updateDocNameDto: UpdateDocNameDto): Promise<DocName> {
      await this.docNameRepository.update({ topic_id: id, course_id: courseId }, updateDocNameDto);
      return this.findOne(id);
  }

    async remove(id: number): Promise<void> {
      const docName = await this.findOne(id);
      await this.docNameRepository.remove(docName);
    }

    private async findOne(id: number): Promise<DocName> {
      const docName = await this.docNameRepository.findOne({ 
        where: { topic_id: id },
        relations: ['courseDoc']
       });
      if (!docName) {
          throw new NotFoundException(`DocName with id ${id} not found`);
      }
      return docName;
  }
}
