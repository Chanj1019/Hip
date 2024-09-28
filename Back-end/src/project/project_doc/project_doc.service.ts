import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateProjectDocDto } from './dto/create-project_doc.dto';
import { UpdateProjectDocDto } from './dto/update-project_doc.dto';
import { ProjectDoc } from './entities/project_doc.entity';
import { Project } from '../projects/entities/project.entity';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드

@Injectable()
export class ProjectDocService {
    private s3: S3Client;
    constructor(
        @InjectRepository(ProjectDoc)
        private readonly projectDocRepository: Repository<ProjectDoc>,
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
    }

    async create(createProjectDocDto: CreateProjectDocDto, file: Express.Multer.File): Promise<ProjectDoc> {
        const projectId = createProjectDocDto.projectId;
        const project = await this.projectRepository.findOne({ where: { project_id: projectId } });

        if (!project) {
            throw new NotFoundException(`ID가 ${projectId}인 프로젝트를 찾을 수 없습니다.`);
        }

        // S3에 파일 업로드
        const uniqueFileName = `${uuidv4()}_${file.originalname}`;
        let uploadResult;

        try {
            const command = new PutObjectCommand({
                Bucket: process.env.AWS_S3_BUCKET_NAME,
                Key: `projects/${uniqueFileName}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            uploadResult = await this.s3.send(command); // S3에 파일 업로드
        } catch (error) {
            console.error(error); // logger로 변경 가능
            throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
        }

        // S3에서 반환된 URL을 file_path에 저장
        const filePath = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/projects/${uniqueFileName}`;

        // filePath가 비어있지 않은지 확인
        if (!filePath) {
            throw new InternalServerErrorException('파일 경로가 비어 있습니다.');
        }

        const projectDoc = this.projectDocRepository.create({
            ...createProjectDocDto,
            project,
            file_path: filePath,
        });

        return await this.projectDocRepository.save(projectDoc);
    }

    async findAll(): Promise<ProjectDoc[]> {
        return await this.projectDocRepository.find({
        relations: ['project'],
        });
    }

    async findOne(id: number, project_id: number): Promise<ProjectDoc> {
        const doc = await this.projectDocRepository.findOne({
            where: {
                project_doc_id: id,
                projectId: project_id,
            },
            relations: ['project'], // 연관된 프로젝트도 함께 가져오기
        });
        this.handleNotFound(doc, id);
        return doc;
    }
  
  
    async update(id: number, updateProjectDocDto: UpdateProjectDocDto): Promise<ProjectDoc> {
        const doc = await this.projectDocRepository.findOne({ where: { project_doc_id: id } });
        this.handleNotFound(doc, id);

        Object.assign(doc, updateProjectDocDto);
        return await this.projectDocRepository.save(doc);
    }

    async remove(id: number): Promise<void> {
        const doc = await this.projectDocRepository.findOne({ where: { project_doc_id: id } });
        this.handleNotFound(doc, id);

        await this.projectDocRepository.remove(doc);
    }

    // 예외 처리
    private handleNotFound(doc: ProjectDoc, id: number): void {
        if (!doc) {
            throw new NotFoundException(`Document with ID ${id} not found`);
        }
    }
}
