import { Injectable,ConflictException } from '@nestjs/common';
import { Exhibition } from './exhibition.entity';
import {HttpException, HttpStatus } from '@nestjs/common'; // HttpException 추가
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
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
    }
      










