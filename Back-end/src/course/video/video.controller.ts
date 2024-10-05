import { Controller, Get, Post, Body, Param, Delete, UseInterceptors, UploadedFile, BadRequestException, Res } from '@nestjs/common';
import { VideoService } from './video.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';

@Controller('courses/:courseId/:videoTopicId/video')
export class VideoController {
    constructor(private readonly videoService: VideoService) {}

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

    @Get(':video_id/stream')
    async stream(
        @Body('courseId') courseId: number,
        @Param('videoTopicId') videoTopicId: number,
        @Param('video_id') videoId: number, 
        @Res() res: Response
    ): Promise<void> {
        await this.videoService.streamVideo(courseId, videoTopicId, videoId, res);
    }

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Body('courseId') courseId: number,
        @Body('videoTopicId') videoTopicId: number,
        @UploadedFile() file: Express.Multer.File
    ): Promise< { message: string }> {
        if (!file) {
            throw new BadRequestException('파일이 전송되지 않았습니다.');
        }
        
        return this.videoService.uploadFile(courseId, videoTopicId, file);
    }

    @Delete(':videoId')
    async removeFile(
        @Body('courseId') courseId: number,
        @Param('videoTopicId') videoTopicId: number,
        @Param('videoId') videoId: number
    ): Promise<void> {
        return this.videoService.removeFile(courseId, videoTopicId, videoId);
    }
}
