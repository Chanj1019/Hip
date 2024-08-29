import { Injectable, NotFoundException,ConflictException } from '@nestjs/common';
import { CreateExhibitionsMemberDto } from './dto/create-exhibitions_member.dto';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { Exhibition } from 'src/exhibitions/exhibition.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ExhibitionService } from 'src/exhibitions/exhibitions.service';
@Injectable()
export class ExhibitionsMemberService {
    constructor(
        @InjectRepository(ExhibitionMember)
        private readonly exhibitionMemberRepository: Repository<ExhibitionMember>,
        @InjectRepository(Exhibition)
        private readonly exhibitionRepository: Repository<Exhibition>,
        private readonly exhibitionService: ExhibitionService,
    ) {}

    // async create(createExhibitionsMemberDto: CreateExhibitionsMemberDto): Promise<ExhibitionMember> {
    //     const exhibition = await this.exhibitionRepository.findOne({
    //         where: { exhibition_id: createExhibitionsMemberDto.exhibitions_id },
    //     });

    //     if (!exhibition) {
    //         throw new NotFoundException('Exhibition not found');
    //     }

    //     const exhibitionMember = this.exhibitionMemberRepository.create({
    //         ...createExhibitionsMemberDto,
    //         exhibition: exhibition,
    //     });

    //     return await this.exhibitionMemberRepository.save(exhibitionMember);
    // }
    async create(createExhibitionsMemberDto: CreateExhibitionsMemberDto): Promise<ExhibitionMember> {
        const exhibition = await this.exhibitionRepository.findOne({
            where: { exhibition_id: createExhibitionsMemberDto.exhibitions_id },
        });
    
        if (!exhibition) {
            throw new NotFoundException('Exhibition not found');
        }
    
        // 중복된 이름 확인
        const existingMember = await this.exhibitionMemberRepository.findOne({
            where: { name: createExhibitionsMemberDto.name, exhibition: exhibition },
        });
    
        if (existingMember) {
            throw new ConflictException('Exhibition member with this name already exists');
        }
    
        const exhibitionMember = this.exhibitionMemberRepository.create({
            ...createExhibitionsMemberDto,
            exhibition: exhibition,
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
        await this.exhibitionMemberRepository.remove(member);
    }
}

