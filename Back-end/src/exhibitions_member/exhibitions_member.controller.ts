import { Controller, Post, Get, Put, Delete, Param, Body } from '@nestjs/common';
import { BadRequestException } from '@nestjs/common';
import { CreateExhibitionsMemberDto } from './dto/create-exhibitions_member.dto';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { ExhibitionMember } from './entities/exhibition_member.entity';

@Controller('exhibition-members')
export class ExhibitionsMemberController {
    constructor(private readonly exhibitionsMemberService: ExhibitionsMemberService) {}

    @Post()
    async create(@Body() createExhibitionsMemberDto: CreateExhibitionsMemberDto): Promise<ExhibitionMember> {
        return this.exhibitionsMemberService.create(createExhibitionsMemberDto);
    }

    @Get()
    async findAll(): Promise<ExhibitionMember[]> {
        return this.exhibitionsMemberService.findAll();
    }

    @Get(':memberId')
    async findOne(@Param('id') id: number): Promise<ExhibitionMember> {
      return this.exhibitionsMemberService.findOne(id);
    }
    

    @Put(':id')
    async update(@Param('id') id: number, @Body() updateData: Partial<CreateExhibitionsMemberDto>): Promise<ExhibitionMember> {
        return this.exhibitionsMemberService.update(id, updateData);
    }

    @Delete(':id')
    async remove(@Param('id') id: number): Promise<void> {
        return this.exhibitionsMemberService.remove(id);
    }
}
