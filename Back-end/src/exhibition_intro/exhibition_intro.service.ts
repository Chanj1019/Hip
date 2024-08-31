import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExhibitionIntro } from './entities/exhibition_intro.entity';
import { CreateExhibitionIntroDto } from './dto/create-exhibition_intro.dto';
import { UpdateExhibitionIntroDto } from './dto/update-exhibition_intro.dto';
import { Exhibition } from 'src/exhibitions/exhibition.entity';

@Injectable()
export class ExhibitionIntroService {
  constructor(
    @InjectRepository(ExhibitionIntro)
    private readonly exhibitionIntroRepository: Repository<ExhibitionIntro>,
    @InjectRepository(Exhibition)
    private readonly exhibitionRepository: Repository<Exhibition>,
  ) {}

 
  async create(createExhibitionIntroDto: CreateExhibitionIntroDto): Promise<ExhibitionIntro> {
    const exhibitionId = Number(createExhibitionIntroDto.exhibition_id);
    const exhibition = await this.exhibitionRepository.findOne({ where: { exhibition_id: exhibitionId } });
  
    if (!exhibition) {
      throw new NotFoundException(`ID가 ${exhibitionId}인 전시를 찾을 수 없습니다.`);
    }
  
    const exhibitionIntro = this.exhibitionIntroRepository.create({
      ...createExhibitionIntroDto,
      exhibition, // exhibition 객체를 직접 할당
    });
  
    return await this.exhibitionIntroRepository.save(exhibitionIntro);
  }
  

  async findAll(): Promise<ExhibitionIntro[]> {
    return await this.exhibitionIntroRepository.find({ relations: ['exhibition'] });
  }

  async findOne(id: number): Promise<ExhibitionIntro> {
    const exhibitionIntro = await this.exhibitionIntroRepository.findOne({
      where: { exhibition_intro_id: id },
      relations: ['exhibition'],
    });
    if (!exhibitionIntro) {
      throw new NotFoundException(`ID가 ${id}인 전시를 찾을 수 없습니다.`);
    }
    return exhibitionIntro;
  }

  async update(id: number, updateExhibitionIntroDto: UpdateExhibitionIntroDto): Promise<ExhibitionIntro> {
    const existingIntro = await this.findOne(id); // 존재 여부 확인
    if (!existingIntro) {
      throw new NotFoundException('해당 intro를 찾을 수 없습니다.');
    }
  
    await this.exhibitionIntroRepository.update(id, updateExhibitionIntroDto);
    return this.findOne(id); // 업데이트된 엔티티 반환
  
  }
  async remove(id: number): Promise<void> {
    const exhibitionIntro = await this.findOne(id); // 존재 여부 확인
    await this.exhibitionIntroRepository.remove(exhibitionIntro);
  }
}
