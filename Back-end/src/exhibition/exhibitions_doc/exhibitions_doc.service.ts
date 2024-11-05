import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExhibitionsDocDto } from './dto/create-exhibitions_doc.dto';
import { UpdateExhibitionsDocDto } from './dto/update-exhibitions_doc.dto';
import { ExhibitionDoc } from './entities/exhibition_doc.entity';
import { Exhibition } from '../exhibitions/exhibition.entity';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';
import { Response } from 'express';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

dotenv.config(); 
@Injectable()
export class ExhibitionsDocService {
    private s3: S3Client;

    constructor(
        @InjectRepository(ExhibitionDoc)
        private readonly exhibitionsDocRepository: Repository<ExhibitionDoc>,
        @InjectRepository(Exhibition)
        private readonly exhibitionRepository: Repository<Exhibition>,
    )  {
    // .env 파일에서 AWS 자격 증명 및 리전 가져오기
        const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
        const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
        const AWS_REGION = process.env.AWS_REGION;
        const S3_BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME;

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

    // async createExhibitionDoc(createExhibitionDocDto: CreateExhibitionsDocDto, file: Express.Multer.File): Promise<ExhibitionDoc> {
    //     const exhibitionId = Number(createExhibitionDocDto.exhibition_id);
    //     const exhibition = await this.exhibitionRepository.findOne({ where: { exhibition_id: exhibitionId } });

    //     if (!exhibition) {
    //         throw new NotFoundException(`ID가 ${exhibitionId}인 전시를 찾을 수 없습니다.`);
    //     }

    //     // S3에 파일 업로드
    //     const uniqueFileName = `${uuidv4()}_${file.originalname}`;
    //     let uploadResult;

    //     try {
    //         const command = new PutObjectCommand({
    //             Bucket: process.env.S3_BUCKET_NAME,
    //             Key: `exhibitions/${uniqueFileName}`,
    //             Body: file.buffer,
    //             ContentType: file.mimetype,
    //         });
    //         uploadResult = await this.s3.send(command); // S3에 파일 업로드
    //     } catch (error) {
    //         console.error(error); // logger로 변경 가능
    //         throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
    //     }

    //     // S3에서 반환된 URL을 file_path에 저장
    //     const filePath = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/exhibitions/${uniqueFileName}`;

    //     // filePath가 비어있지 않은지 확인
    //     if (!filePath) {
    //         throw new InternalServerErrorException('파일 경로가 비어 있습니다.');
    //     }

    //     const exhibitionDoc = this.exhibitionsDocRepository.create({
    //         ...createExhibitionDocDto,
    //         exhibition,
    //         file_path: filePath,
    //     });

    //     return await this.exhibitionsDocRepository.save(exhibitionDoc);
    // }
    async createExhibitionDocs(
        exhibitionId: number, 
        files: Express.Multer.File[], 
        outputVideo: Express.Multer.File[]
    ): Promise<ExhibitionDoc[]> {
        const exhibition = await this.exhibitionRepository.findOne({ where: { exhibition_id: exhibitionId } });
    
        if (!exhibition) {
            throw new NotFoundException(`ID가 ${exhibitionId}인 전시를 찾을 수 없습니다.`);
        }
    
        const exhibitionDocs: ExhibitionDoc[] = [];
    
        // 이미지 처리
        if (!Array.isArray(files) || files.length === 0) {
            throw new BadRequestException('이미지 파일이 배열이 아닙니다.');
        }
    
        for (const file of files) {
            const uniqueFileName = `${uuidv4()}_${file.originalname}`;
            let uploadResult;
    
            try {
                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: `exhibitions/images/${uniqueFileName}`,
                    Body: file.buffer,
                    ContentType: file.mimetype,
                });
                uploadResult = await this.s3.send(command);
            } catch (error) {
                console.error(error);
                throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
            }
    
            const filePath = `exhibitions/images/${uniqueFileName}`;
    
            const exhibitionDoc = this.exhibitionsDocRepository.create({
                exhibition,
                file_path: filePath,
            });
    
            exhibitionDocs.push(await this.exhibitionsDocRepository.save(exhibitionDoc));
        }
    
        // 비디오 처리
        if (outputVideo && outputVideo.length > 0) {
            const videoFile = outputVideo[0]; // 비디오 파일은 배열로 전달되므로 첫 번째 요소 사용
            const uniqueVideoFileName = `${uuidv4()}_${videoFile.originalname}`;
            let uploadResult;
    
            try {
                const command = new PutObjectCommand({
                    Bucket: process.env.AWS_S3_BUCKET_NAME,
                    Key: `exhibitions/videos/${uniqueVideoFileName}`,
                    Body: videoFile.buffer,
                    ContentType: videoFile.mimetype,
                });
                uploadResult = await this.s3.send(command);
            } catch (error) {
                console.error(error);
                throw new InternalServerErrorException('비디오 업로드에 실패했습니다.');
            }
    
            const videoFilePath = `exhibitions/videos/${uniqueVideoFileName}`;
    
            const exhibitionVideoDoc = this.exhibitionsDocRepository.create({
                exhibition,
                file_path: videoFilePath,
            });
    
            exhibitionDocs.push(await this.exhibitionsDocRepository.save(exhibitionVideoDoc));
        }
    
        return exhibitionDocs; // 모든 전시 문서 반환
    }
    
    
    async findAll(): Promise<ExhibitionDoc[]> {
        return await this.exhibitionsDocRepository.find({
            relations: ['exhibition'],
        });
    }

    async findOne(id: number): Promise<ExhibitionDoc> {
    
        if (id <= 0) {
            throw new BadRequestException('유효하지 않은 ID입니다.');
        }
  
        const doc = await this.exhibitionsDocRepository.findOne({
        where: { exhibition_doc_id: id },
        relations: ['exhibition'],
        });
  
        if (!doc) {
            throw new NotFoundException('자료를 찾을 수 없습니다.');
        }
  
        return doc;
    }
  
  
    async update(id: number, updateExhibitionsDocDto: UpdateExhibitionsDocDto): Promise<ExhibitionDoc> {
        const doc = await this.findOne(id);
  
        if (updateExhibitionsDocDto.exhibitions_id) {
        const exhibition = await this.exhibitionRepository.findOne({ where: { exhibition_id: updateExhibitionsDocDto.exhibitions_id } });
        if (!exhibition) {
            throw new NotFoundException(`ID가 ${updateExhibitionsDocDto.exhibitions_id}인 전시를 찾을 수 없습니다.`);
        }
        }

        Object.assign(doc, updateExhibitionsDocDto);
        return await this.exhibitionsDocRepository.save(doc);
    }

    async remove(id: number): Promise<void> {
        const doc = await this.findOne(id);
        await this.exhibitionsDocRepository.remove(doc);
    }


    async streamVideo(
        exhibition_doc_id: number,
        res: Response
    ): Promise<void> {
        const video = await this.exhibitionsDocRepository.findOne({
            where: { exhibition_doc_id }
        });

        if (!exhibition_doc_id || !video.file_path) {
            throw new NotFoundException('비디오를 찾을 수 없습니다.');
        }

        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        if (!bucketName) {
            throw new Error('AWS S3 bucket name is not configured');
        }

        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: video.file_path,
            });

            const data = await this.s3.send(command);
            const stream = data.Body as Readable; // 타입을 Readable로 명시적으로 지정

            if (!stream) {
                throw new Error('파일 스트림을 가져올 수 없습니다.');
            }
                res.setHeader('Content-Type', 'video/mp4'); // MIME 타입 설정
                res.setHeader('Accept-Ranges', 'bytes'); // 바이트 범위 수신 허용

                // 스트리밍을 위해 파이프하기
                stream.pipe(res);
        } catch (error) {
            console.error('비디오 스트리밍 실패:', error);
            throw new InternalServerErrorException(`비디오 스트리밍에 실패했습니다: ${error.message}`);
        }
    }

    async getSignedUrl(exhibition_doc_id: number): Promise<string> {
        const exhibitionDoc = await this.exhibitionsDocRepository.findOne({
            where: { exhibition_doc_id: exhibition_doc_id}
        })
        if(!exhibitionDoc){
            console.error('유효하지 않은 exhibition_doc_id:', exhibition_doc_id);
            throw new Error('전시 정보를 찾을 수 없습니다.'); // 오류 던지기
        }
        const filePath = exhibitionDoc.file_path;
        console.log('파일 경로: ', filePath)
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filePath,
        });

        try {
            // 프리사인드 URL 생성
            const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 600 });
            return signedUrl; // URL 반환
        } catch (error) {
            console.error('프리사인드 URL 생성 실패:', error);
            throw new Error('프리사인드 URL 생성 중 오류가 발생했습니다.'); // 오류 발생
        }
    }

}