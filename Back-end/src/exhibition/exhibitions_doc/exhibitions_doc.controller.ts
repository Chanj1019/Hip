import { Controller, Get, Post, Put, Delete, Body, Param , UseGuards, UploadedFiles} from '@nestjs/common';
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
        { name: 'files', maxCount: 5 } // 'files' 필드에서 여러 이미지 파일을 업로드 받음
    ]))
    @Roles('admin')
    async createExhibitionDoc(
        @Body() createExhibitionDocDto: CreateExhibitionsDocDto,
        @UploadedFiles() files: { files?: Express.Multer.File[] } // 업로드된 파일들을 가져옴
    ): Promise<{ message: string; docs: any[] }> { // 반환 타입 정의
        const docs = await this.exhibitionDocsService.createExhibitionDocs(createExhibitionDocDto.exhibition_id, files.files);
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
