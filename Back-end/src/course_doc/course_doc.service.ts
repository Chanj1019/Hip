import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CourseDoc } from './entities/course_doc.entity';
import { DocName } from '../doc_name/entities/doc_name.entity';
import { CreateCourseDocDto } from './dto/create-course_doc.dto';
import { UpdateCourseDocDto } from './dto/update-course_doc.dto';
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import { ConfigService } from '@nestjs/config';
import { Readable } from 'stream';
import { Response } from 'express';

@Injectable()
export class CourseDocService {
    private s3: S3Client;

    constructor(
        @InjectRepository(CourseDoc)
        private readonly courseDocRepository: Repository<CourseDoc>,
        @InjectRepository(DocName)
        private readonly docNameRepository: Repository<DocName>,
    ) {
        const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
        const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
        const AWS_REGION = process.env.AWS_REGION;

        this.s3 = new S3Client({
          region: AWS_REGION,
          credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          },
        });
    }

    async uploadFile(
        createCourseDocDto: CreateCourseDocDto,
        file: Express.Multer.File
      ): Promise<string> {
        const fileName = `${uuidv4()}-${file.originalname}`;
        
        try {
          const command = new PutObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: fileName,
            Body: file.buffer,
            ContentType: file.mimetype,
          });
          await this.s3.send(command);
      
          const url = `https://${process.env.AWS_S3_BUCKET_NAME}.s3.amazonaws.com/${fileName}`;

          // 파일 정보를 저장하는 메서드 호출
          await this.saveFile(url, createCourseDocDto);
          
          return url;
        } catch (error) {
          throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
        }
      }
      

      async saveFile(
        file_path: string,
        createCourseDocDto: CreateCourseDocDto
      ): Promise<void> {
        try {
          const fileUpload = this.courseDocRepository.create({
            file_path,
            ...createCourseDocDto, // DTO의 다른 필드들을 포함
          });
          await this.courseDocRepository.save(fileUpload);
        } catch (error) {
          throw new BadRequestException('파일 URL 저장에 실패했습니다.');
        }
      }
    // [file을 자른다]의 의미, 클라와 서버에서의 처리 과정
    async downloadFile(filePath: string): Promise<Buffer> {
        const fileUpload = await this.courseDocRepository.findOne({ where: { file_path: filePath } });
        if (!fileUpload) {
            throw new BadRequestException('파일을 찾을 수 없습니다.');
        }

        const key = fileUpload.file_path.split('/').pop();

        const command = new GetObjectCommand({
          Bucket: process.env.AWS_S3_BUCKET_NAME,
          Key: key,
        });

        try {
            const data = await this.s3.send(command);
            if (!data.Body) {
                throw new Error('파일 스트림을 가져올 수 없습니다.');
            }

            const stream = data.Body as Readable;

            const chunks: Buffer[] = [];
            for await (const chunk of stream) {
                chunks.push(Buffer.from(chunk));
            }
            

            return Buffer.concat(chunks);
        } catch (error) {
            console.error('파일 다운로드 중 오류 발생:', error);
            throw new Error('파일 다운로드에 실패했습니다.');
        }
    }

    async findAll(courseTitle: string, docNameTitle: string): Promise<CourseDoc[]> {
        return await this.courseDocRepository.find({ 
            where: { docName: { topic_title: docNameTitle, course_title: courseTitle } }, 
            relations: ['docName'],
        });
    }

    async findOne(courseTitle: string, docNameTitle: string, id: number): Promise<CourseDoc> {
        const courseDoc = await this.courseDocRepository.findOne({
            where: { course_document_id: id, docName: { topic_title: docNameTitle, course_title: courseTitle } },
            relations: ['docName'],
        });

        if (!courseDoc) {
            throw new NotFoundException(`Course Document with id ${id} not found`);
        }

        return courseDoc;
    }

    async update(courseTitle: string, docNameTitle: string, id: number, updateCourseDocDto: UpdateCourseDocDto, file?: Express.Multer.File): Promise<CourseDoc> {
        const courseDoc = await this.findOne(courseTitle, docNameTitle, id);

        Object.assign(courseDoc, updateCourseDocDto);

        if (file) {
            courseDoc.file_path = file.path;
        }

        return await this.courseDocRepository.save(courseDoc);
    }

    async remove(courseTitle: string, docNameTitle: string, id: number): Promise<void> {
        const courseDoc = await this.findOne(courseTitle, docNameTitle, id);
        await this.courseDocRepository.remove(courseDoc);
    }
}
