import { Controller } from '@nestjs/common';
import { ExhibitionService} from './exhibitions.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { Exhibition } from './exhibition.entity';
import { Get, Post, Body,Query, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
@Controller('exhibitions')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService
    ) {}

    @Post('register')
    async create(@Body() createExhibitionDto: CreateExhibitionDto): Promise<{ message: string; exhibition: Exhibition }> {
        const exhibition = await this.exhibitionService.create(createExhibitionDto);
        return { message: '등록이 완료되었습니다', exhibition };
    }

    //모든 전시 조회
    @Get()
    async findAll(): Promise<{ message: string; exhibitions: Exhibition[] }> {
        const exhibitions = await this.exhibitionService.findAll();
        return { message: '모든 전시 조회를 완료했습니다.', exhibitions };
    }

    //특정 전시 조회
    @Get(':exhibitionsid')
    async findOne(@Param('exhibitionsid') exhibitionsaId: number): Promise<{ message: string; exhibition: Exhibition }> {
        const exhibition = await this.exhibitionService.findOne(exhibitionsaId);
        return { message: '전시 조회를 완료했습니다.', exhibition };
    }
    
    //내용이나 제목 , 내용+ 제목 으로 키워드 조회
    @Get('search')
    async searchExhibitions(
    @Query('keyword') keyword: string,
    @Query('searchIn') searchIn: 'title' | 'description' | 'both',
    ): Promise<Exhibition[]> {
        return this.exhibitionService.searchExhibitions(keyword, searchIn);
    }


    //날짜 시간순 정렬
    @Get('sorted-by-date')
    async getExhibitionsSortedByDate(
     @Query('order') order: 'ASC' | 'DESC' = 'ASC', // 기본값은 'ASC'
        ): Promise<Exhibition[]> {
        return this.exhibitionService.getExhibitionsSortedByDate(order);
    }


    //특정 기수 통게
    @Get('count/by-generation')
    async countExhibitionsBygeneration(
        @Query('generation') generation: string,
    ): Promise<number> {
        return this.exhibitionService.countExhibitionsBygeneration(generation);
    }
    
    // 특정 시간의 전시 수 통계
    // @Get('count/by-exhibition_date')
    // async countExhibitionsByexhibition_date(
    //     @Query('exhibition_date') exhibition_date: string, // ISO 형식의 문자열로 받을 수 있습니다.
    // ): Promise<number> {
    //     return this.exhibitionService.countExhibitionsByexhibition_date(new Date(exhibition_date));
    // }

    
    @Delete(':exhibitionsid')
    async remove(@Param('userid') exhibitionsaId: number): Promise<{ message: string }> {
        await this.exhibitionService.remove(exhibitionsaId);
        return { message: '전시가 삭제되었습니다.' };
    }












}
