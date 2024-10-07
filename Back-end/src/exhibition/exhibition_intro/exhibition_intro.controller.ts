import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards } from '@nestjs/common';
import { ExhibitionIntroService } from './exhibition_intro.service';
import { CreateExhibitionIntroDto } from './dto/create-exhibition_intro.dto';
import { UpdateExhibitionIntroDto } from './dto/update-exhibition_intro.dto';
import { ExhibitionIntro } from './entities/exhibition_intro.entity';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

@Controller('exhibition-intro')
export class ExhibitionIntroController {
    constructor(private readonly exhibitionIntroService: ExhibitionIntroService) {}

    @Post('register')
    @UseGuards(JwtAuthGuard)
    async create(@Body() createExhibitionIntroDto: CreateExhibitionIntroDto): Promise<{ message: string; intros: ExhibitionIntro[]; }> {
        const intros = await this.exhibitionIntroService.create(createExhibitionIntroDto);
        return { message: 'intro 생성이 완료되었습니다.', intros };
    }

    @Get()
    async findAll():Promise<{ message:string; intro:ExhibitionIntro[] }> {
        const intro = await this.exhibitionIntroService.findAll();
        return { message:'전체 조회가 완료되었습니다', intro }
    }

    @Get(':id')
    async findOne(@Param('id') id: string):Promise<{ message:string; intro:ExhibitionIntro }> {
        const intro = await this.exhibitionIntroService.findOne(+id);
        return { message:'intro 조회를 완료했습니다', intro };
    }

    @Patch()
    @UseGuards(JwtAuthGuard)
    async update(
        // @Param('id') id: string, Number(id),  // URL에서 전달받은 ID
        @Body() updateExhibitionIntroDto: UpdateExhibitionIntroDto,
    ): Promise<{ message: string; intros: ExhibitionIntro[] }> {
        const intros = await this.exhibitionIntroService.update(updateExhibitionIntroDto); // id를 Number로 변환하여 전달
        return { message: 'intro가 성공적으로 업데이트되었습니다.', intros };
    }
    
    
    
    @Delete(':id')
    @UseGuards(JwtAuthGuard)
    async remove(@Param('id') id: string): Promise<{ message:string }> {
        await this.exhibitionIntroService.remove(+id);
        return { message:'intro가 삭제되었습니다' };
    }
}
