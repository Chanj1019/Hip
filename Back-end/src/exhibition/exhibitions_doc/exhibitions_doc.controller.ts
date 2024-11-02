import { Controller, Get, Post, Put, Delete, Body, Param , UseGuards, UploadedFiles, BadRequestException} from '@nestjs/common';
import { ExhibitionsDocService } from './exhibitions_doc.service';
import { CreateExhibitionsDocDto } from './dto/create-exhibitions_doc.dto';
import { UpdateExhibitionsDocDto } from './dto/update-exhibitions_doc.dto';
import { ExhibitionDoc } from './entities/exhibition_doc.entity';
import { UseInterceptors, UploadedFile } from '@nestjs/common';
import { FileFieldsInterceptor, FileInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';

// @UseGuards(JwtAuthGuard,RolesGuard)
@Controller('exhibition-docs')
export class ExhibitionsDocController {
    constructor(private readonly exhibitionDocsService: ExhibitionsDocService) {}

    // @Post('register')
    // @UseInterceptors(FileInterceptor('file')) // 'file' 필드에서 파일을 업로드 받음
    // @Roles('admin')
    // async createExhibitionDoc(
    //     @Body() createExhibitionDocDto: CreateExhibitionsDocDto,
    //     @UploadedFile() file: Express.Multer.File, // 업로드된 파일을 가져옴
    // ): Promise<{ message: string; doc: any }> { // 반환 타입 정의
    //     const doc = await this.exhibitionDocsService.createExhibitionDoc(createExhibitionDocDto, file);
    //     return { message: '전시 문서가 성공적으로 등록되었습니다.', doc };
    // }
  
    @Post('register')
    @UseInterceptors(FileFieldsInterceptor([
        { name: 'outputImages', maxCount: 5 }, // 최대 5개의 이미지 파일
        { name: 'outputVideo', maxCount: 1 }   // 최대 1개의 비디오 파일
    ]))
    async createExhibitionDoc(
        @Body() createExhibitionDocDto: CreateExhibitionsDocDto,
        @UploadedFiles() files: { outputImages?: Express.Multer.File[]; outputVideo?: Express.Multer.File[] }
    ): Promise<{ message: string; docs: any[] }> {
        // 배열 체크
        const images = files.outputImages || [];
        const video = files.outputVideo ? [files.outputVideo[0]] : []; // 비디오도 배열로 처리
        console.log('수신된 이미지:', images);
        console.log('이미지 개수:', images.length);
        if (!Array.isArray(images) || !Array.isArray(video)) {
            throw new BadRequestException('파일이 올바르게 전달되지 않았습니다.');
        }
    
        const docs = await this.exhibitionDocsService.createExhibitionDocs(createExhibitionDocDto.exhibitions_id, images, video);
        return { message: '전시 문서가 성공적으로 등록되었습니다.', docs };
    }
    

    @Get()
    async findAll(): Promise<{doc:ExhibitionDoc[];message: string}> {
        const doc = await this.exhibitionDocsService.findAll();
        return { message:'전체 자료 조회를 완료했습니다.',doc };
    }
  
    @Get(':id')
    async findOne(@Param('id') id: number): Promise<{ doc: ExhibitionDoc; message: string }> {
        const doc =await this.exhibitionDocsService.findOne(id);
        return { message:'자료 조회를 완료했습니다.', doc };
    }

    @Put(':id')
    @Roles('admin')
    async update(
        @Param('id') id: number,
        @Body() updateExhibitionsDocDto: UpdateExhibitionsDocDto,
    ): Promise<{ doc: ExhibitionDoc; message: string }> {
        const doc = await this.exhibitionDocsService.update(id, updateExhibitionsDocDto);
        return { message: '전시 문서가 성공적으로 업데이트 되었습니다.', doc };
    } 
  
    @Delete(':id')
    @Roles('admin')
    async remove(@Param('id') id: number): Promise<{ message: string }> {
        await this.exhibitionDocsService.remove(id);
        return ({ message: '성공적으로 삭제되었습니다.' });
    }
}
