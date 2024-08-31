import { Injectable, NotFoundException,ConflictException,InternalServerErrorException } from '@nestjs/common';
import { CreateExhibitionsMemberDto } from './dto/create-exhibitions_member.dto';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { Exhibition } from 'src/exhibitions/exhibition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExhibitionService } from 'src/exhibitions/exhibitions.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';

dotenv.config(); // .env 파일 로드
@Injectable()
export class ExhibitionsMemberService {
     private s3: S3Client;
    constructor(
        @InjectRepository(ExhibitionMember)
        private readonly exhibitionMemberRepository: Repository<ExhibitionMember>,
        @InjectRepository(Exhibition)
        private readonly exhibitionRepository: Repository<Exhibition>,
        private readonly exhibitionService: ExhibitionService,
    ) { // .env 파일에서 AWS 자격 증명 및 리전 가져오기
        const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
        const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
        const AWS_REGION = process.env.AWS_REGION;
        const S3_BUCKET_NAME = process.env.S3_BUCKET_NAME;
    
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

      async create(createExhibitionsMemberDto: CreateExhibitionsMemberDto, file: Express.Multer.File): Promise<ExhibitionMember> {
        // 전시 정보 조회
        const exhibition = await this.exhibitionRepository.findOne({
            where: { exhibition_id: createExhibitionsMemberDto.exhibitions_id },
        });
    
        if (!exhibition) {
            throw new NotFoundException('전시를 찾을 수 없습니다.');
        }
    
        // S3에 파일 업로드
        const uniqueFileName = `${uuidv4()}_${file.originalname}`;
        let uploadResult;
    
        try {
            const command = new PutObjectCommand({
                Bucket: process.env.S3_BUCKET_NAME,
                Key: `exhibition_members/${uniqueFileName}`,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            uploadResult = await this.s3.send(command); // S3에 파일 업로드
        } catch (error) {
            console.error(error); // logger로 변경 가능
            throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
        }
    
        // S3에서 반환된 URL을 file_path에 저장
        const filePath = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/exhibition_members/${uniqueFileName}`;
    
        // 새로운 전시 멤버 생성
        const exhibitionMember = this.exhibitionMemberRepository.create({
            ...createExhibitionsMemberDto,
            exhibition: exhibition,
            file_path: filePath,  // file_path 추가
        });
    
        return await this.exhibitionMemberRepository.save(exhibitionMember);
    }
    
    
    async findAll(): Promise<ExhibitionMember[]> {
        return await this.exhibitionMemberRepository.find({ relations: ['exhibition'] });
    }

    
    async findOne(id: number): Promise<ExhibitionMember> {
        const member = await this.exhibitionMemberRepository.findOne({
            where: { exhibition_member_id: id },
            relations: ['exhibition'],
        });

        if (!member) {
            throw new NotFoundException(`ExhibitionMember with ID ${id} not found`);
        }

        return member;
    }

    async update(id: number, updateData: Partial<CreateExhibitionsMemberDto>): Promise<ExhibitionMember> {
        const member = await this.findOne(id); // 존재 여부 확인
    
        // 외래 키 유효성 확인 (예: exhibitionId가 유효한지 확인)
        if (updateData.exhibitions_id) {
            const exhibition = await this.exhibitionService.findOne(String(updateData.exhibitions_id));
            if (!exhibition) {
                throw new NotFoundException(`Exhibition with ID ${updateData.exhibitions_id} not found`);
            }
        }
        
    
        // 업데이트 할 데이터를 member에 병합
        const updatedMember = Object.assign(member, updateData);
    
        // 업데이트 수행
        await this.exhibitionMemberRepository.save(updatedMember);
    
        return updatedMember; // 업데이트된 데이터 반환
    }

    async remove(id: number): Promise<void> {
        const member = await this.findOne(id); // 존재 여부 확인

        // S3에서 파일 삭제
        const filePath = member.file_path.split('/').pop(); // 파일 이름 추출
        const deleteCommand = new DeleteObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `exhibition_members/${filePath}`, // S3에서 삭제할 파일 경로
        });

        try {
            await this.s3.send(deleteCommand); // S3에서 파일 삭제
        } catch (error) {
            console.error(error); // logger로 변경 가능
            throw new InternalServerErrorException('파일 삭제에 실패했습니다.');
        }

        await this.exhibitionMemberRepository.remove(member); // 데이터베이스에서 멤버 삭제
    }

    async downloadFile(id: number): Promise<Readable> {
        const member = await this.findOne(id); // 존재 여부 확인
        const filePath = member.file_path.split('/').pop(); // 파일 이름 추출
        
        const getCommand = new GetObjectCommand({
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `exhibition_members/${filePath}`, // 다운로드할 파일 경로
        });

        try {
            const response = await this.s3.send(getCommand); // S3에서 파일 가져오기
            return response.Body as Readable; // Readable 스트림 반환
        } catch (error) {
            console.error(error);
            throw new InternalServerErrorException('파일 다운로드에 실패했습니다.');
        }
    }
}

