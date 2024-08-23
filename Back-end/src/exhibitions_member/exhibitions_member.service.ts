import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateExhibitionsMemberDto } from './dto/create-exhibitions_member.dto';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { Exhibition } from 'src/exhibitions/exhibition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class ExhibitionsMemberService {
    constructor(
        @InjectRepository(ExhibitionMember)
        private readonly exhibitionMemberRepository: Repository<ExhibitionMember>,
        @InjectRepository(Exhibition)
        private readonly exhibitionRepository: Repository<Exhibition>,
    ) {}

    async create(createExhibitionsMemberDto: CreateExhibitionsMemberDto): Promise<ExhibitionMember> {
      const exhibitionId = createExhibitionsMemberDto.exhibitions_id;
      const exhibition = await this.exhibitionRepository.findOne({ where: { exhibition_id: exhibitionId } });
  
        if (!exhibition) {
            throw new NotFoundException('Exhibition not found');
        }

        const exhibitionMember = this.exhibitionMemberRepository.create({
            ...createExhibitionsMemberDto,
            exhibition: exhibition,
        });

        return this.exhibitionMemberRepository.save(exhibitionMember);
    }

    async findAll(): Promise<ExhibitionMember[]> {
        return this.exhibitionMemberRepository.find({ relations: ['exhibition'] });
    }

    async findOne(id: number): Promise<ExhibitionMember> {
        const member = await this.exhibitionMemberRepository.findOne({
            where: { exhibition_member_id:id }, // ID를 명시적으로 지정
            relations: ['exhibition'], // 관계된 exhibition 데이터 로드
        });
    
        if (!member) {
            throw new NotFoundException(`ExhibitionMember with ID ${id} not found`); // ID 포함된 에러 메시지
        }
    
        return member;
    }
    

    async update(id: number, updateData: Partial<CreateExhibitionsMemberDto>): Promise<ExhibitionMember> {
        await this.findOne(id); // 존재 여부 확인
        await this.exhibitionMemberRepository.update(id, updateData);
        return this.findOne(id); // 업데이트된 데이터 반환
    }

    async remove(id: number): Promise<void> {
        const member = await this.findOne(id); // 존재 여부 확인
        await this.exhibitionMemberRepository.remove(member);
    }
}
