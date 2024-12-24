import { Injectable } from '@nestjs/common';
import { CreateProjectKeyDocDto } from './dto/create-project_key_doc.dto';
import { UpdateProjectKeyDocDto } from './dto/update-project_key_doc.dto';
import { ProjectKeyDocResponseDto } from './dto/project_key_doc-response.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { ProjectKeyDoc } from './entities/project_key_doc.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProjectKeyDocService {

  constructor(
      @InjectRepository(ProjectKeyDoc)
      private readonly projectKeyDocRepository: Repository<ProjectKeyDoc>,
    ) {}
    
  async create(
    createProjectKeyDocDto: CreateProjectKeyDocDto
  ): Promise<ProjectKeyDoc> {
    const projectKeyDoc = this.projectKeyDocRepository.create(createProjectKeyDocDto);
    return this.projectKeyDocRepository.save(projectKeyDoc);
  }

  async findAll(

  ): Promise<ProjectKeyDoc[]> {
    return this.projectKeyDocRepository.find();
  }

  async findOne(
    id: number
  ): Promise<ProjectKeyDoc> {
    return this.projectKeyDocRepository.findOne({
      where: { key_doc_id: id }
    });
  }

  async update(
    id: number,
    updateProjectKeyDocDto: UpdateProjectKeyDocDto
  ): Promise<ProjectKeyDoc> {
    const projectKeyDoc = await this.findOne(id);
    Object.assign(projectKeyDoc, updateProjectKeyDocDto);
    return this.projectKeyDocRepository.save(projectKeyDoc);
  }

  async remove(
    id: number
  ): Promise<void> {
    const projectKeyDoc = await this.findOne(id);
    await this.projectKeyDocRepository.remove(projectKeyDoc);
  }
}
