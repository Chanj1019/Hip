import { Injectable, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CreateExhibitionsMembersDto } from './dto/create-exhibitions_member.dto';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { Exhibition } from '../exhibitions/exhibition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExhibitionService } from '../exhibitions/exhibitions.service';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';
import { Readable } from 'stream';
import { UpdateExhibitionMemberDto } from './dto/update-exhibitions_member.dto';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

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
    ) {
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

    async create(
        createExhibitionsMembersDto: CreateExhibitionsMembersDto,
        files: Express.Multer.File[]
    ): Promise<ExhibitionMember[]> {
        const members: ExhibitionMember[] = [];

        const exhibitionExists = await this.exhibitionRepository.findOne({
            where: { exhibition_id: createExhibitionsMembersDto.exhibitions_id }
        });

        if (!exhibitionExists) {
            throw new NotFoundException(`Exhibition with ID ${createExhibitionsMembersDto.exhibitions_id} not found.`);
        }

        // 각 멤버를 순회하면서 파일을 연결
        for (let i = 0; i < createExhibitionsMembersDto.members.length; i++) {
            const memberData = createExhibitionsMembersDto.members[i];
            let filePath = '';

            // 파일이 존재하는 경우 S3에 업로드
            if (files[i]) {
                const uniqueFileName = `${uuidv4()}_${files[i].originalname}`;
                try {
                    const command = new PutObjectCommand({
                        Bucket: process.env.AWS_S3_BUCKET_NAME,
                        Key: `exhibition_members/${uniqueFileName}`,
                        Body: files[i].buffer,
                        ContentType: files[i].mimetype,
                    });
                    await this.s3.send(command); // S3에 파일 업로드
                    filePath = `exhibition_members/${uniqueFileName}`;
                } catch (error) {
                    console.error(error);
                    throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
                }
            }

            // 새로운 전시 멤버 생성
            const exhibitionMember = this.exhibitionMemberRepository.create({
                ...memberData,
                exhibition: { exhibition_id: createExhibitionsMembersDto.exhibitions_id },
                file_path: filePath, // S3에서 반환된 URL을 file_path에 저장
            });

            members.push(await this.exhibitionMemberRepository.save(exhibitionMember)); // 멤버 저장
        }

        return members; // 생성된 멤버 배열 반환
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

    async update(id: number, updateData: UpdateExhibitionMemberDto): Promise<ExhibitionMember> {
        const member = await this.findOne(id); // 존재 여부 확인
    
        // 외래 키 유효성 확인 (exhibitions_id가 필요한 경우)
        if (updateData.exhibitions_id) {
            const exhibition = await this.exhibitionService.findOne((updateData.exhibitions_id));
            if (!exhibition) {
                throw new NotFoundException(`Exhibition with ID ${updateData.exhibitions_id} not found`);
            }
        }
    
        // 업데이트할 데이터를 member에 병합
        Object.assign(member, updateData); // member 객체에 updateData를 병합
    
        // 업데이트 수행
        return await this.exhibitionMemberRepository.save(member); // 업데이트된 멤버 반환
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

    async getSignedUrl(exhibition_member_id: number): Promise<string> {
        const exhibitionMember = await this.exhibitionMemberRepository.findOne({
            where: { exhibition_member_id: exhibition_member_id}
        })
        if(!exhibitionMember){
            console.error('유효하지 않은 exhibition_member_id:', exhibition_member_id);
            throw new Error('전시 정보를 찾을 수 없습니다.'); // 오류 던지기
        }
        const filePath = exhibitionMember.file_path;
        console.log('파일 경로: ', filePath)
        const command = new GetObjectCommand({
            Bucket: process.env.AWS_S3_BUCKET_NAME,
            Key: filePath,
        });

        try {
            // 프리사인드 URL 생성
            const signedUrl = await getSignedUrl(this.s3, command, { expiresIn: 60 });
            return signedUrl; // URL 반환
        } catch (error) {
            console.error('프리사인드 URL 생성 실패:', error);
            throw new Error('프리사인드 URL 생성 중 오류가 발생했습니다.'); // 오류 발생
        }
    }
}
