import { Controller, Post, Get, Put, Delete, Body, Param, UseGuards, UploadedFiles } from '@nestjs/common';
import { ExhibitionsMemberService } from './exhibitions_member.service';
import { CreateExhibitionsMembersDto } from './dto/create-exhibitions_member.dto';
import { ExhibitionMember } from './entities/exhibition_member.entity';
import { UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { UpdateExhibitionMemberDto } from './dto/update-exhibitions_member.dto';

// @UseGuards(JwtAuthGuard, RolesGuard)
@Controller('exhibition-members')
export class ExhibitionsMemberController {
    constructor(private readonly exhibitionsMemberService: ExhibitionsMemberService) {}

    @Post('register')
    // @Roles('admin')
    @UseInterceptors(FilesInterceptor('members[*][image]')) // 'image'는 클라이언트에서 보내는 파일 필드 이름
    async create(
        @Body() createExhibitionsMembersDto: CreateExhibitionsMembersDto,
        @UploadedFiles() files: Express.Multer.File[] // 여러 파일 정보
    ): Promise<{ members: ExhibitionMember[]; message: string }> {
        // 각 멤버의 이미지 파일을 연결하여 멤버 생성
        const members = await this.exhibitionsMemberService.create(createExhibitionsMembersDto, files);
        return { message: '멤버들이 생성되었습니다.', members }; // 생성된 멤버 반환
    }

    @Get()
    // @Roles('admin')
    async findAll(): Promise<{ members: ExhibitionMember[]; message: string }> {
        const members = await this.exhibitionsMemberService.findAll();
        return { message: '전체 멤버를 조회했습니다', members }; // 모든 전시 멤버 반환
    }

    @Get(':id')
    // @Roles('admin')
    async findOne(@Param('id') id: number): Promise<{ member: ExhibitionMember; message: string }> {
        const member = await this.exhibitionsMemberService.findOne(id);
        return { message: `Id가 ${id}인 멤버를 조회했습니다.`, member }; // 특정 전시 멤버 반환
    }

    @Put(':id')
    // @Roles('admin')
    async update(
        @Param('id') id: number,
        @Body() updateData: UpdateExhibitionMemberDto // UpdateExhibitionMemberDto 사용
    ): Promise<{ member: ExhibitionMember; message: string }> {
        const member = await this.exhibitionsMemberService.update(id, updateData);
        return { message: `${id}인 멤버를 수정했습니다`, member }; // 업데이트된 전시 멤버 반환
    }

    @Delete(':id')
    // @Roles('admin')
    async remove(@Param('id') id: number): Promise<{ message: string }> {
        await this.exhibitionsMemberService.remove(id);
        return { message: '삭제 완료되었습니다.' }; // 삭제 완료 메시지 반환
    }

    // @Roles('admin')
    @Get('presigned-url/:exhibition_member_id')
    async getPresignedUrl(
        @Param('exhibition_member_id') exhibition_member_id: number
    ): Promise<{ url: string }> {
        // console.log(`Request for presigned URL for exhibition ID: ${exhibitionId}`);
        const url = await this.exhibitionsMemberService.getSignedUrl(exhibition_member_id);
        // console.log('Generated presigned URLs:', url);
        return { url };
    }
}
