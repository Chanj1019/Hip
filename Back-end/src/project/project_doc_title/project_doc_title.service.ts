import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { CreateProjectDocTitleDto } from './dto/create-project_doc_title.dto';
import { UpdateProjectDocTitleDto } from './dto/update-project_doc_title.dto';
import { ProjectDocTitle } from './entities/project_doc_title.entity';
import { Project } from '../projects/entities/project.entity';
import { S3Client } from '@aws-sdk/client-s3';
import * as dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

@Injectable()
export class ProjectDocTitleService {
    private s3: S3Client;
    constructor(
        @InjectRepository(ProjectDocTitle)
        private readonly projectDocRepository: Repository<ProjectDocTitle>,
        @InjectRepository(Project)
        private readonly projectRepository: Repository<Project>,
    )  {
        // .env 파일에서 AWS 자격 증명 및 리전 가져오기
        const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
        const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
        const AWS_REGION = process.env.AWS_REGION;
        const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;
        console.log(S3_BUCKET_NAME)
        if (!S3_BUCKET_NAME) {
            throw new InternalServerErrorException('S3 버킷 이름이 설정되지 않았습니다.');
        }

        // S3 클라이언트 초기화
        this.s3 = new S3Client({
            region: AWS_REGION,
            credentials: {
                accessKeyId: AWS_ACCESS_KEY_ID,
                secretAccessKey: AWS_SECRET_ACCESS_KEY,
            },
        });
        if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION) {
            throw new InternalServerErrorException('AWS 환경 변수가 제대로 설정되지 않았습니다.');
        }
    }

    // 프로젝트 ID가 유효한지 확인
    async validateProjectId(projectId: number): Promise<void> {
        const project = await this.projectRepository.findOne({ where: {project_id: projectId }});
        if (!project) {
            throw new NotFoundException(`Project with ID ${projectId} not found`);
        }
    }

    async create(projectId: number, createProjectDocDto: CreateProjectDocTitleDto): Promise<ProjectDocTitle> {
        try {
            await this.validateProjectId(projectId);
            const project = await this.projectRepository.findOne({ where: {project_id: projectId }});

            const projectDoc = this.projectDocRepository.create({
                ...createProjectDocDto,
                project,
            });
            return await this.projectDocRepository.save(projectDoc);
        } catch (error) {
            console.error(error); // logger로 변경 가능
            throw new InternalServerErrorException('문서명 저장에 실패했습니다.');
        }
    }

    async findAll(projectId: number): Promise<ProjectDocTitle[]> {
        await this.validateProjectId(projectId);
        return await this.projectDocRepository.find({
            where: { project: { project_id: projectId } },
            relations: ['project', 'feedbacks'],
        });
    }

    async findOne(id: number, projectId: number): Promise<ProjectDocTitle> {
        await this.validateProjectId(projectId);

        const doc = await this.projectDocRepository.findOne({
            where: {
                project_doc_title_id: id,
            },
            relations: ['project', 'feedbacks'], // 연관된 프로젝트도 함께 가져오기
        });
        if (!doc) {
            throw new NotFoundException(`Registration with ID ${id} not found`);
        }
        return doc;
    }
  
    // pa_title_id가 null인 title 조회 메서드
    async findRootDocTitle(
        projectId: number
    ): Promise<ProjectDocTitle[]> {
        await this.validateProjectId(projectId);
        const project = await this.projectRepository.findOne({
            where: { project_id: projectId }
        });
        if (!project) {
            throw new NotFoundException("해당 프로젝트를 찾을 수 없습니다.");
        }
        const doctitles = await this.projectDocRepository.find({
            where : { pa_title_id: IsNull() },
            relations: ['project_docs', 'subTitles'],
        });
        
        return doctitles
    }

  
    async update(id: number, updateProjectDocDto: UpdateProjectDocTitleDto, projectId: number): Promise<ProjectDocTitle> {
        const doc = await this.findOne(id, projectId);

        Object.assign(doc, updateProjectDocDto);
        return await this.projectDocRepository.save(doc);
    }

    async remove(id: number, projectId: number): Promise<void> {
        await this.findOne(id, projectId);

        await this.projectDocRepository.delete(id);
    }

    async findById(id: number): Promise<ProjectDocTitle> {
        if (id <= 0) {
            throw new BadRequestException('유효하지 않은 ID입니다.');
        }
  
        const doc = await this.projectDocRepository.findOne({
        where: { project_doc_title_id: id },
        relations: ['project'],
        });
  
        if (!doc) {
            throw new NotFoundException('자료를 찾을 수 없습니다.');
        }
  
        return doc;
    }
}
