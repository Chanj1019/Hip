import { Injectable, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExhibitionsDocDto } from './dto/create-exhibitions_doc.dto';
import { UpdateExhibitionsDocDto } from './dto/update-exhibitions_doc.dto';
import { ExhibitionDoc } from './entities/exhibition_doc.entity';
import { Exhibition } from '../exhibitions/exhibition.entity';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

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

    async createExhibitionDocs(exhibitionId: number, files: Express.Multer.File[]): Promise<ExhibitionDoc[]> {
        const exhibition = await this.exhibitionRepository.findOne({ where: { exhibition_id: exhibitionId } });
    
        if (!exhibition) {
            throw new NotFoundException(`ID가 ${exhibitionId}인 전시를 찾을 수 없습니다.`);
        }
    
        const exhibitionDocs: ExhibitionDoc[] = [];
    
        // 이미지 처리
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
    
            const filePath = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/exhibitions/images/${uniqueFileName}`;
    
            const exhibitionDoc = this.exhibitionsDocRepository.create({
                exhibition,
                file_path: filePath,
            });
    
            exhibitionDocs.push(await this.exhibitionsDocRepository.save(exhibitionDoc));
        }
    
        return exhibitionDocs; // 저장된 모든 전시 문서 반환
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
  
        if (updateExhibitionsDocDto.exhibition_id) {
        const exhibition = await this.exhibitionRepository.findOne({ where: { exhibition_id: updateExhibitionsDocDto.exhibition_id } });
        if (!exhibition) {
            throw new NotFoundException(`ID가 ${updateExhibitionsDocDto.exhibition_id}인 전시를 찾을 수 없습니다.`);
        }
        }

        Object.assign(doc, updateExhibitionsDocDto);
        return await this.exhibitionsDocRepository.save(doc);
    }

    async remove(id: number): Promise<void> {
        const doc = await this.findOne(id);
        await this.exhibitionsDocRepository.remove(doc);
    }
}