import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res, Patch, NotFoundException } from '@nestjs/common';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
import { UpdateVideoDto } from './dto/update-video.dto';
import { OpenaiService } from '../../openai/openai.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { VideoResponseDto } from './dto/video-response.dto';
import { ApiResponse } from 'src/common/api-response.dto';


@Controller('courses/:courseId/:videoTopicId/video')
export class VideoController {
    constructor(private readonly videoService: VideoService,
               private readonly openaiService: OpenaiService
    ) {}

    // @Post('register')
    // async create(
    //     @Param('courseTitle') courseTitle: string,
    //     @Param('videoTopicId') videoTopicId: number,
    //     @Body() createVideoDto: CreateVideoDto
    // ) {
    //     return await this.videoService.create(courseTitle, videoTopicId, createVideoDto);
    // }

    // @Get('all')
    // async findAll(
    //     @Param('courseTitle') courseTitle: string,
    //     @Param('videoTopicId') videoTopicId: number,
    // ) {
    //     return await this.videoService.findAll(courseTitle, videoTopicId);
    // }

    // @Get(':id')
    // async findOne(
    //     @Param('courseTitle') courseTitle: string,
    //     @Param('videoTopicId') videoTopicId: number,
    //     @Param('id') id: number
    // ) {
    //     return await this.videoService.findOne(courseTitle, videoTopicId, id);
    // }

    // @Patch(':id')
    // async update(
    //     @Param('courseTitle') courseTitle: string,
    //     @Param('videoTopicId') videoTopicId: number,
    //     @Param('id') id: number, 
    //     @Body() updateVideoDto: UpdateVideoDto
    // ) {
    //     return await this.videoService.update(courseTitle, videoTopicId, id, updateVideoDto);
    // }

    // @Delete(':id')
    // async remove(
    //     @Param('courseTitle') courseTitle: string,
    //     @Param('videoTopicId') videoTopicId: number,
    //     @Param('id') id: number
    // ) {
    //     return await this.videoService.remove(courseTitle, videoTopicId, id);
    // }


    // @Get('upload-url')
    // async getUploadUrl(
    //     @Query('fileName') fileName: string, 
    //     @Query('fileType') fileType: string
    // ) {
    //   const uploadUrl = await this.videosService.getUploadUrl(fileName, fileType);
    //   return { uploadUrl };
    // }

    // Express의 res를 활용한 직접 스트리밍(controller 코드)
    // @Get(':video_id/stream')
    // async stream(
    //     @Param('courseId') courseId: number,
    //     @Param('videoTopicId') videoTopicId: number,
    //     @Param('video_id') videoId: number, 
    //     @Res() res: Response
    // ): Promise<void> {
    //     await this.videoService.streamVideo(courseId, videoTopicId, videoId, res);
    // }

    @Get(':video_id/stream')
    async stream(
        @Param('courseId') courseId: number,
        @Param('videoTopicId') videoTopicId: number,
        @Param('video_id') videoId: number, 
    ): Promise<ApiResponse<VideoResponseDto>> {
        return await this.videoService.streamVideo( courseId, videoTopicId, videoId );
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Param('courseId') courseId: number,
        @Body() createVideoDto: CreateVideoDto,
        @Param('videoTopicId') videoTopicId: number,
        @UploadedFile() file: Express.Multer.File
    ): Promise< { message: string }> {
        if (!file) {
            throw new BadRequestException('파일이 전송되지 않았습니다.');
        }
        
        return this.videoService.uploadVideo(courseId, createVideoDto, videoTopicId, file);
    }

    @Patch('update/:videoId')
    async update(
        @Param('courseId') courseId: number,
        @Param('videoTopicId') videoTopicId: number,
        @Param('id') id: number, 
        @Body() updateVideoDto: UpdateVideoDto
    ) {
        return await this.videoService.updateVideo(courseId, videoTopicId, id, updateVideoDto);
    }

    @Delete(':videoId/delete')
    async removeFile(
        @Param('courseId') courseId: number,
        @Param('videoTopicId') videoTopicId: number,
        @Param('videoId') videoId: number
    ): Promise<void> {
        return this.videoService.removeFile(courseId, videoTopicId, videoId);
    }

    @Post('presigned-url')
    async getPreSignedUrl(
        @Body() body: { fileName: string, fileType: string }
    ): Promise<{ url: string }> {
        const { fileName, fileType } = body;
        const url = await this.videoService.generatePreSignedUrl(fileName, fileType);
        return { url };
    }

    @Post('stt/:videoId')
    async processVideo(
        @Param('courseId') courseId: number,
        @Param('videoTopicId') videoTopicId: number,
        @Param('videoId') videoId: number
    ): Promise<{ summary: string }> {
        // videoId를 사용하여 비디오 URL을 가져옵니다.
        const video = await this.videoService.findVideo(courseId, videoTopicId, videoId);
        
        if (!video || !video.video_url) {
            throw new NotFoundException('비디오를 찾을 수 없습니다.');
        }
    
        // 비디오 URL을 사용하여 OpenAI 서비스에 요청
        const { summary } = await this.openaiService.processVideo(video.video_url);
    
        // 요약을 데이터베이스에 저장
        video.Summary = summary;
        await this.videoService.videoUpdate(video); // 비디오 엔티티를 업데이트하는 서비스 메서드 필요
        
        return { summary };
    }
    
    @Get('summary/:videoId')
    async asd(
        @Param('courseId') courseId: number,
        @Param('videoTopicId') videoTopicId: number,
        @Param('videoId') videoId: number
    ): Promise<{ summary: string }> {
        // videoId를 사용하여 비디오 URL을 가져옵니다.
        const video = await this.videoService.findVideo(courseId, videoTopicId, videoId);
        
        if (!video || !video.video_url) {
            throw new NotFoundException('비디오를 찾을 수 없습니다.');
        }
    
        // 비디오 URL을 사용하여 OpenAI 서비스에 요청
        const { summary } = await this.openaiService.processVideo(video.video_url);
    
        // 요약을 데이터베이스에 저장
        video.Summary = summary;
        await this.videoService.videoUpdate(video); 
        
        return { summary };
    }
}
