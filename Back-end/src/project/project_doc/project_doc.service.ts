import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateProjectDocDto } from './dto/create-project_doc.dto';
import { UpdateProjectDocDto } from './dto/update-project_doc.dto';
import { PutObjectCommand, PutObjectCommandOutput, S3Client } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from '../projects/entities/project.entity';
import { Repository } from 'typeorm';
import { ProjectDoc } from './entities/project_doc.entity';
import { ProjectDocResponseDto } from './dto/project_doc-response.dto';
import { FeedbackResponseDto } from '../feedback/dto/feedback-response.dto';
import { ApiResponse } from 'src/common/api-response.dto';

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

  async create(
    projectId: number, 
    projectDocTitleId: number, 
    createProjectDocDto: CreateProjectDocDto, 
    file: Express.Multer.File
  ): Promise<ProjectDocResponseDto> {
    // S3에 파일 업로드
    const uniqueFileName = `${uuidv4()}_${file.originalname}`;
    let uploadResult: PutObjectCommandOutput;

    try {
      const command = new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME,
        Key: `projects/${uniqueFileName}`,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
      uploadResult = await this.s3.send(command);
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
    }

    // S3에서 반환된 URL을 file_path에 저장
    const filePath = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/projects/${uniqueFileName}`;

    if (!filePath) {
      throw new InternalServerErrorException('파일 경로가 비어 있습니다.');
    }

    // 프로젝트 ID 유효성 검사
    const project = await this.projectRepository.findOne({ where: { project_id: projectId } });
    if (!project) {
      throw new InternalServerErrorException('유효하지 않은 프로젝트 ID입니다.');
    }

    // 프로젝트 문서명 ID 유효성 검사
    const projectDocTitle = await this.projectDocRepository.findOne({ where: { project_doc_id: projectDocTitleId } });
    if (!projectDocTitle) {
      throw new InternalServerErrorException('유효하지 않은 프로젝트 문서명 ID입니다.');
    }

    // 프로젝트 문서 등록
    const projectDoc = this.projectDocRepository.create({
      ...createProjectDocDto,
      url: filePath,
      projectDocTitle: projectDocTitle,
    });

    const savedProjectDoc = await this.projectDocRepository.save(projectDoc);

    const completeProjectDoc = await this.projectDocRepository.findOne({
      where: { project_doc_id: savedProjectDoc.project_doc_id },
      relations: ['feedbacks'],
    });

    if (!completeProjectDoc) {
      throw new InternalServerErrorException('프로젝트 문서를 저장했지만 그 후 조회할 수 없습니다.');
    }

    return new ProjectDocResponseDto(completeProjectDoc);
  }

  async findAll(

  ): Promise<ProjectDocResponseDto[]> {
    try {
      const projectDocs = await this.projectDocRepository.find({
        relations: ['feedbacks'],
      });

      const data = projectDocs.map((doc) => new ProjectDocResponseDto(doc));

      return data;
    } catch (error) {
      throw new InternalServerErrorException('전체 프로젝트 문서 조회에 실패했습니다.');
    }
  }

  async findOne(
    id: number
  ): Promise<ProjectDocResponseDto> {
    const projectDoc = await this.projectDocRepository.findOne({
      where: { project_doc_id: id },
      relations: ['feedbacks'],
    });

    if (!projectDoc) {
      throw new InternalServerErrorException('해당 문서를 찾을 수 없습니다.');
    }

    return new ProjectDocResponseDto(projectDoc);
  }

  async update(
    id: number, 
    updateProjectDocDto: UpdateProjectDocDto
  ): Promise<ProjectDocResponseDto> {
    const projectDoc = await this.projectDocRepository.findOne({
      where: { project_doc_id: id },
      relations: ['feedbacks'],
    });

    if (!projectDoc) {
      throw new InternalServerErrorException('수정할 문서를 찾을 수 없습니다.');
    }

    Object.assign(projectDoc, updateProjectDocDto);

    const updatedDoc = await this.projectDocRepository.save(projectDoc);
    return new ProjectDocResponseDto(updatedDoc);
  }

  async remove(
    id: number
  ): Promise<void> {
    const projectDoc = await this.projectDocRepository.findOne({
      where: { project_doc_id: id },
      relations: ['feedbacks'],
    });

    if (!projectDoc) {
      throw new InternalServerErrorException('삭제할 문서를 찾을 수 없습니다.');
    }
    await this.projectDocRepository.remove(projectDoc);
  }
}
