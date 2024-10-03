import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseDoc } from './entities/course_doc.entity';
import { DocName } from '../doc_name/entities/doc_name.entity';
import { Course } from '../courses/entities/course.entity'
import { CreateCourseDocDto } from './dto/create-course_doc.dto';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';

@Injectable()
export class CourseDocService {
    private s3: S3Client;

    constructor(
        @InjectRepository(CourseDoc)
        private readonly courseDocRepository: Repository<CourseDoc>,
        @InjectRepository(DocName)
        private readonly docNameRepository: Repository<DocName>,
        @InjectRepository(Course)
        private readonly coursesRepository: Repository<Course>,
        private readonly configService: ConfigService 
    ) {
        const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
        const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
        const AWS_REGION = process.env.AWS_REGION;
        const AWS_S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

        if (!AWS_ACCESS_KEY_ID || !AWS_SECRET_ACCESS_KEY || !AWS_REGION || !AWS_S3_BUCKET_NAME) {
            throw new BadRequestException('AWS 관련 환경 변수가 설정되지 않았습니다. 모든 변수를 확인해주세요.');
        }

        this.s3 = new S3Client({
            region: AWS_REGION,
            credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          },
        });
    }

    private async validate(
        courseTitle: string, 
        topicTitle: string,
    ): Promise<void> {
        const CourseTitle = await this.coursesRepository.findOne({
            where: { course_title: courseTitle }
        })
        if (!CourseTitle) {
            throw new NotFoundException('강의를 찾을 수 없습니다.')
        }
        const DocName = await this.docNameRepository.findOne({
            where: { topic_title: topicTitle }
        })
        if (!DocName) {
            throw new NotFoundException('자료 주제를 찾을 수 없습니다.')
        }
    }

    async uploadFile(
        courseTitle: string,
        topicTitle: string,
        createCourseDocDto: CreateCourseDocDto,
        file: Express.Multer.File
    ): Promise<string> {
        await this.validate(courseTitle, topicTitle);
        const fileName = `${uuidv4()}-${file.originalname}`;
        const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
        if (!bucketName) {
            throw new Error('AWS S3 bucket name is not configured');
        }
        try {
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.s3.send(command);
            const url = `${fileName}`; // 저장할 객체 키 명시적으로 작성
            await this.saveFile(url);
            return url;
        } catch (error) {
            console.error('File upload error:', error);
            throw new InternalServerErrorException(`파일 업로드에 실패했습니다: ${error.message}`);
        }
    }
      

    async saveFile(
        file_path: string
    ): Promise<void> {
        try {
            const fileUpload = this.courseDocRepository.create({
                file_path
            });
            await this.courseDocRepository.save(fileUpload);
        } catch (error) {
            console.error('File save error:', error);
            throw new BadRequestException(`파일 URL 저장에 실패했습니다: ${error.message}`);
        }
    }
    
    async downloadFile(
        url: string
    ): Promise<{ stream: Readable; metadata: any }> {
        const bucketName = this.configService.get<string>('AWS_S3_BUCKET_NAME');
    
        const command = new GetObjectCommand({
            Bucket: bucketName,
            Key: url, // URL에서 추출한 객체 키 사용
        });
    
        try {
            const data = await this.s3.send(command);
            if (!data.Body) {
                throw new Error('파일 스트림을 가져올 수 없습니다.');
            }

            const stream = data.Body as Readable;
            return { 
                stream,
                metadata: {
                    ContentType: data.ContentType,
                    ContentLength: data.ContentLength,
                }
            };
            // const stream = data.Body as Readable;
            // return stream
            // const chunks: Buffer[] = [];
            // for await (const chunk of stream) {
            //     chunks.push(Buffer.from(chunk));
            // }
            // return Buffer.concat(chunks);
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            throw new InternalServerErrorException('파일 다운로드에 실패했습니다.');
        }
    }
    
    async findAll(courseTitle: string, docNameTitle: string): Promise<CourseDoc[]> {
        try {
            await this.validate(courseTitle, docNameTitle);
            return await this.courseDocRepository.find();
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            throw new BadRequestException('전체 조회에 실패했습니다.');
        }
    }

    async findOne(courseTitle: string, docNameTitle: string, id: number): Promise<CourseDoc> {
        try {
            await this.validate(courseTitle, docNameTitle)
            const courseDoc = await this.courseDocRepository.findOne({
                where: { course_document_id: id },
                relations: ['docName'],
            });
            if (!courseDoc) {
                throw new NotFoundException(`Course Document with id ${id} not found`);
            }
            return courseDoc;
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            throw new BadRequestException('조회에 실패했습니다.');
        }
    }

    async findById(id: number): Promise<CourseDoc> {
        if (id <= 0) {
            throw new BadRequestException('유효하지 않은 ID입니다.');
        }
  
        const doc = await this.courseDocRepository.findOne({
        where: { course_document_id: id },
        relations: ['course'],
        });
  
        if (!doc) {
            throw new NotFoundException('자료를 찾을 수 없습니다.');
        }
  
        return doc;
    }
    // async update(courseTitle: string, docNameTitle: string, id: number, file?: Express.Multer.File): Promise<CourseDoc> {
    //     const courseDoc = await this.findOne(courseTitle, docNameTitle, id);

    //     Object.assign(courseDoc);

    //     if (file) {
    //         courseDoc.file_path = file.path;
    //     }

    //     return await this.courseDocRepository.save(courseDoc);
    // }

    async remove(courseTitle: string, docNameTitle: string, id: number): Promise<void> {
        try {
            const courseDoc = await this.findOne(courseTitle, docNameTitle, id);
            await this.courseDocRepository.remove(courseDoc);
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            throw new BadRequestException('삭제에 실패했습니다.');
        }
    }
}
