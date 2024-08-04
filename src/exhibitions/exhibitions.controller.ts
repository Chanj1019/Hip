import { Controller } from '@nestjs/common';
import { ExhibitionService} from './exhibitions.service';
import { CreateExhibitionDto } from './dto/create-exhibition.dto';
import { Exhibition } from './exhibition.entity';
import { Get, Post, Body, Param, Delete, Put, HttpException, HttpStatus } from '@nestjs/common';
@Controller('exhibitions')
export class ExhibitionController {
    constructor(private readonly exhibitionService: ExhibitionService
    ) {}

    @Post('register')
    async create(@Body() createExhibitionDto: CreateExhibitionDto): Promise<{ message: string; exhibition: Exhibition }> {
        const exhibition = await this.exhibitionService.create(createExhibitionDto);
        return { message: '등록이 완료되었습니다', exhibition };
    }













}
