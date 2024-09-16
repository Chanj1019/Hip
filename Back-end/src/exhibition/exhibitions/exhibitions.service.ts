import { Injectable,ConflictException,BadRequestException,NotFoundException,InternalServerErrorException} from '@nestjs/common';
import { Exhibition } from './exhibition.entity';
import {HttpException, HttpStatus } from '@nestjs/common'; // HttpException 추가
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not } from 'typeorm';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { UpdateExhibitionDto } from './dto/update-exhibition.dto';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

dotenv.config(); // .env 파일 로드
@Injectable()
export class ExhibitionService {
        private s3: S3Client;
        constructor(
            @InjectRepository(Exhibition)
            private exhibitionsRepository: Repository<Exhibition>
        ) { 
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

        async create(createExhibitionDto: CreateExhibitionDto, file: Express.Multer.File): Promise<Exhibition> {
            const existingExhibition = await this.exhibitionsRepository.findOne({
                where: { exhibition_title: createExhibitionDto.exhibition_title },
            });

            if (existingExhibition) {
                throw new ConflictException('이미 존재하는 전시회 제목입니다.');
            }

            // 파일이 제공되었는지 확인
            let filePath = null;
            if (file) {
                const uniqueFileName = `${uuidv4()}_${file.originalname}`;
                try {
                    const command = new PutObjectCommand({
                        Bucket:process.env.S3_BUCKET_NAME,
                        Key: `exhibitions/${uniqueFileName}`,
                        Body: file.buffer,
                        ContentType: file.mimetype,
                    });
                    await this.s3.send(command);
                    filePath = `https://${process.env.S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/exhibitions/${uniqueFileName}`;
                } catch (error) {
                    console.error('파일 업로드 오류:', error);
                    throw new InternalServerErrorException('파일 업로드에 실패했습니다.');
                }
            }

            // 전시회 객체 생성
            const exhibition = this.exhibitionsRepository.create({
                ...createExhibitionDto,
                exhibition_date: new Date(), // 현재 날짜를 자동으로 설정
                file_path: filePath, // 파일 경로 저장
            });

            return await this.exhibitionsRepository.save(exhibition);
        }
        async findAll(): Promise<Exhibition[]> {
            return await this.exhibitionsRepository.find();
        }
    
        async findOne(exhibitionTitle: string): Promise<Exhibition> {
            if (!exhibitionTitle) {
                throw new BadRequestException('Exhibition title must be provided');
            }
        
            const exhibition = await this.exhibitionsRepository.findOne({
                where: { exhibition_title: exhibitionTitle },
                relations: ['exhibitionDocs', 'exhibitionMembers','exhibitionIntros'],
            });
        
            if (!exhibition) {
                throw new NotFoundException('Exhibition not found');
            }
        
            return exhibition;
        }

        //내용이나 제목 , 내용+ 제목 으로 키워드 조회
        async searchExhibitions(keyword: string, searchIn: 'title' | 'description' | 'both'): Promise<Exhibition[]> {
            const queryBuilder = this.exhibitionsRepository.createQueryBuilder('exhibition');
          
            if (searchIn === 'title') {
              queryBuilder.where('exhibition.title LIKE :keyword', { keyword: `%${keyword}%` });
            } else if (searchIn === 'description') {
              queryBuilder.where('exhibition.description LIKE :keyword', { keyword: `%${keyword}%` });
            } else if (searchIn === 'both') {
              queryBuilder.where('exhibition.title LIKE :keyword OR exhibition.description LIKE :keyword', { keyword: `%${keyword}%` });
            }
          
            return queryBuilder.getMany();
        }

        
        //날짜 시간순 정렬
        async getExhibitionsSortedByDate(order: 'ASC' | 'DESC'): Promise<Exhibition[]> {
            return this.exhibitionsRepository.find({
                order: {
                    exhibition_date: order, // 'date' 필드를 기준으로 정렬
                },
             });
        }

        //기수별 정렬
        async getExhibitionsSortedByGeneration(order: 'ASC' | 'DESC'): Promise<Exhibition[]> {
            return this.exhibitionsRepository.find({
                order: {
                    generation: order, // 
                },
            });
        }

        //특정 기수 전시 통계
        async countExhibitionsBygeneration(generation: string): Promise<number> {
            return this.exhibitionsRepository.count({
              where: {
                generation: generation, // 'generation' 필드가 존재해야 합니다.
              },
            });
        }

        async remove(exhibitionTitle: string): Promise<void> {
            const result = await this.exhibitionsRepository.delete({
                exhibition_title: exhibitionTitle,
            });
        
            if (result.affected === 0) {
                throw new NotFoundException(`Exhibition with title "${exhibitionTitle}" not found`);
            }
        }
        
        //  async updateExhibition(
        //     exhibitionTitle: string, // 전시 제목
        //     updateExhibitionDto: UpdateExhibitionDto // DTO 사용
        // ): Promise<Exhibition> { // 반환 타입 변경
        //     const { generation, description } = updateExhibitionDto;
                
        //     const exhibition = await this.exhibitionsRepository.findOne({ where: { exhibition_title: exhibitionTitle } });
            
        //     if (!exhibition) {
        //         throw new NotFoundException('전시를 찾을 수 없습니다');
        //     }
        
        //     // 전시 제목 중복 검사
        //     if (updateExhibitionDto.exhibition_title) {
        //         const newTitle = updateExhibitionDto.exhibition_title;
        
        //         // 현재 제목과 새 제목이 동일한 경우
        //         if (exhibition.exhibition_title === newTitle) {
        //             throw new ConflictException('전시 제목이 현재 제목과 동일합니다');
        //         }
        
        //         const isTitleDuplicate = await this.isTitleDuplicate(newTitle, exhibition.exhibition_id);
        //         if (isTitleDuplicate) {
        //             throw new ConflictException('전시 제목이 이미 존재합니다');
        //         }
        
        //         exhibition.exhibition_title = newTitle; // 제목 업데이트
        //     }
        
        //     // 각 필드가 제공된 경우에만 업데이트
        //     if (generation) {
        //         exhibition.generation = generation; // 세대 업데이트
        //     }
        //     if (description) {
        //         exhibition.description = description; // 설명 업데이트
        //     }
            
        //     await this.exhibitionsRepository.save(exhibition); // 업데이트된 전시 정보 저장
            
        //     return exhibition; // 업데이트된 전시 정보 반환
        // }
        
        
        // async isTitleDuplicate(exhibition_title: string, exhibitionsId: number): Promise<boolean> {
        //     const existingExhibition = await this.exhibitionsRepository.findOne({
        //         where: { exhibition_title, exhibition_id: Not(exhibitionsId) } // 현재 업데이트 중인 전시 제외
        //     });
        //     return existingExhibition !== null; // 존재하면 true, 아니면 false
        // }
        async updateExhibition(
            exhibitionTitle: string,
            updateExhibitionDto: UpdateExhibitionDto
        ): Promise<Exhibition> {
            const { generation, description } = updateExhibitionDto;
        
            const exhibition = await this.exhibitionsRepository.findOne({ where: { exhibition_title: exhibitionTitle } });
        
            if (!exhibition) {
                throw new NotFoundException('전시를 찾을 수 없습니다');
            }
        
            // 전시 제목 중복 검사
            if (updateExhibitionDto.exhibition_title) {
                const newTitle = updateExhibitionDto.exhibition_title;
        
                if (exhibition.exhibition_title === newTitle) {
                    throw new ConflictException('전시 제목이 현재 제목과 동일합니다');
                }
        
                if (await this.isTitleDuplicate(newTitle, exhibition.exhibition_id)) {
                    throw new ConflictException('전시 제목이 이미 존재합니다');
                }
        
                exhibition.exhibition_title = newTitle; // 제목 업데이트
            }
        
            // 각 필드가 제공된 경우에만 업데이트
            if (generation) {
                exhibition.generation = generation; // 세대 업데이트
            }
            if (description) {
                exhibition.description = description; // 설명 업데이트
            }
        
            await this.exhibitionsRepository.save(exhibition); // 업데이트된 전시 정보 저장
        
            return exhibition; // 업데이트된 전시 정보 반환
        }
        
        async isTitleDuplicate(exhibition_title: string, exhibitionsId: number): Promise<boolean> {
            const count = await this.exhibitionsRepository.count({
                where: { exhibition_title, exhibition_id: Not(exhibitionsId) }
            });
            return count > 0; // 존재하면 true, 아니면 false
        }
        

    }
      










