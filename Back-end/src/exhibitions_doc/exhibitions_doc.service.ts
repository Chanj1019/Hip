import { Injectable, NotFoundException ,BadRequestException} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateExhibitionsDocDto } from './dto/create-exhibitions_doc.dto';
import { UpdateExhibitionsDocDto } from './dto/update-exhibitions_doc.dto';
import { ExhibitionDoc } from './entities/exhibition_doc.entity'; // 엔티티 경로에 맞게 수정
import { Exhibition } from 'src/exhibitions/exhibition.entity';

@Injectable()
export class ExhibitionsDocService {
  constructor(
    @InjectRepository(ExhibitionDoc)
    private readonly exhibitionsDocRepository: Repository<ExhibitionDoc>,
    @InjectRepository(Exhibition)
    private readonly exhibitionRepository: Repository<Exhibition>,
  ) {}



  async createExhibitionDoc(createExhibitionDocDto: CreateExhibitionsDocDto): Promise<ExhibitionDoc> {
    // exhibition_id를 숫자로 변환하고 유효성 검사
    const exhibitionId = Number(createExhibitionDocDto.exhibition_id);
    if (isNaN(exhibitionId)) {
        throw new BadRequestException('유효하지 않은 전시 ID입니다.');
    }

    // 전시를 외래키로 참조하기 위해 전시를 찾음
    const exhibition = await this.exhibitionRepository.findOneBy({ exhibition_id: exhibitionId });

    // 전시가 존재하지 않으면 오류 발생
    if (!exhibition) {
        throw new NotFoundException(`ID가 ${exhibitionId}인 전시를 찾을 수 없습니다.`);
    }

    // 새로운 ExhibitionDoc 객체 생성
    const exhibitionDoc = this.exhibitionsDocRepository.create({
        ...createExhibitionDocDto,
        exhibition, // 외래키 설정
    });

    // 데이터베이스에 전시 문서 저장
    return await this.exhibitionsDocRepository.save(exhibitionDoc);
}

    
  async findAll(): Promise<ExhibitionDoc[]> {
    return await this.exhibitionsDocRepository.find({
      relations: ['exhibition'], // 관련된 전시 데이터도 함께 가져옴
    });
  }
  
  async findOne(id: number): Promise<ExhibitionDoc> {
    const doc = await this.exhibitionsDocRepository.findOne({
      where: { exhibition_doc_id: id },
      relations: ['exhibition'], // 외래키에 해당하는 전시 데이터도 함께 가져옴
    });
  
    if (!doc) {
      throw new NotFoundException(`자료를 찾을 수 없습니다.`);
    }
    return doc;
  }
  
  async update(id: number, updateExhibitionsDocDto: UpdateExhibitionsDocDto): Promise<ExhibitionDoc> {
    const doc = await this.findOne(id); // 기존의 findOne 메서드 재사용
  
    // 외래키 유효성 검사 (exhibition_id가 제공된 경우)
    if (updateExhibitionsDocDto.exhibition_id) {
      const exhibition = await this.exhibitionRepository.findOneBy({ exhibition_id: updateExhibitionsDocDto.exhibition_id });
      if (!exhibition) {
        throw new BadRequestException(`ID가 ${updateExhibitionsDocDto.exhibition_id}인 전시를 찾을 수 없습니다.`);
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
