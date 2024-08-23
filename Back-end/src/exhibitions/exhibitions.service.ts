import { Injectable,ConflictException } from '@nestjs/common';
import { Exhibition } from './exhibition.entity';
import {HttpException, HttpStatus } from '@nestjs/common'; // HttpException 추가
import { InjectRepository } from '@nestjs/typeorm';
import { Repository,Not } from 'typeorm';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
@Injectable()
export class ExhibitionService {
    
        constructor(
            @InjectRepository(Exhibition)
            private exhibitionsRepository: Repository<Exhibition>
        ) {}

        async create(createExhibitionDto: CreateExhibitionDto): Promise<Exhibition> {

            const existingExhibition = await this.exhibitionsRepository.findOne({
                where: { exhibition_title: createExhibitionDto.exhibition_title },
            });
    
            if (existingExhibition) {
                throw new ConflictException('이미 존재하는 전시회 제목입니다.');
            }
            const exhibition = this.exhibitionsRepository.create({
                ...createExhibitionDto,
                exhibition_date: new Date(), // 현재 날짜를 자동으로 설정
            });
            return await this.exhibitionsRepository.save(exhibition);
        }

        async findAll(): Promise<Exhibition[]> {
            return await this.exhibitionsRepository.find();
        }
    
        async findOne(exhibitionsaId: number): Promise<Exhibition> {
            return await this.exhibitionsRepository.findOneBy({ exhibition_id: exhibitionsaId });
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

        // 특정 시간의 전시 수 집계
        // async countExhibitionsByexhibition_date(exhibition_date: Date): Promise<number> {
        //     return this.exhibitionsRepository.count({
        //     where: {
        //         exhibition_date:exhibition_date, // 'exhibition_date' 필드가 존재해야 합니다.
        //     },
        //     });
        // }
        async remove(exhibitionsaId: number): Promise<void> {
            await this.exhibitionsRepository.delete(exhibitionsaId);
        }
    

        async updateExhibition(
            exhibitionsId: number,
            exhibition_title?: string,  // 선택적 파라미터로 변경
            generation?: string,        // 선택적 파라미터로 변경
            description?: string        // 선택적 파라미터로 변경
        ): Promise<void> {
            const exhibition = await this.exhibitionsRepository.findOneBy({ exhibition_id: exhibitionsId });
        
            if (!exhibition) {
                throw new Error('전시를 찾을 수 없습니다'); // 일반 오류 던지기
            }
        
            // 전시 제목 중복 검사 (제목이 제공된 경우에만 검사)
            if (exhibition_title) {
                const isTitleDuplicate = await this.isTitleDuplicate(exhibition_title, exhibitionsId);
                if (isTitleDuplicate) {
                    throw new Error('전시 제목이 이미 존재합니다'); // 일반 오류 던지기
                }
                exhibition.exhibition_title = exhibition_title; // 제목 업데이트
            }
        
            // 각 필드가 제공된 경우에만 업데이트
            if (generation) {
                exhibition.generation = generation; // 세대 업데이트
            }
            if (description) {
                exhibition.description = description; // 설명 업데이트
            }
        
            await this.exhibitionsRepository.save(exhibition); // 업데이트된 전시 정보 저장
        }
        
        async isTitleDuplicate(exhibition_title: string, exhibitionsId: number): Promise<boolean> {
            const existingExhibition = await this.exhibitionsRepository.findOne({
                where: { exhibition_title, exhibition_id: Not(exhibitionsId) } // 현재 업데이트 중인 전시 제외
            });
            return existingExhibition !== null; // 존재하면 true, 아니면 false
        }
        

    }
      










