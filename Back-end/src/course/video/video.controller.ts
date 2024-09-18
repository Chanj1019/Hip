import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFile, BadRequestException } from '@nestjs/common';
import { VideoService } from './video.service';
import { CreateVideoDto } from './dto/create-video.dto';
import { UpdateVideoDto } from './dto/update-video.dto';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('courses/:courseTitle/:videoTopicTitle/video')
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

    @Post('upload')
    @UseInterceptors(FileInterceptor('file'))
    async uploadFile(
        @Body('courseTitle') courseTitle: string,
        @Body('videoTopicId') videoTopicId: number,
        @UploadedFile() file: Express.Multer.File
    ): Promise< { message: string }> {
        if (!file) {
            throw new BadRequestException('파일이 전송되지 않았습니다.');
        }
        
        return this.videoService.uploadFile(courseTitle, videoTopicId, file);
    }

    @Delete(':videoId')
    async removeFile(@Param('videoId') videoId: number): Promise<void> {
        return this.videoService.removeFile(videoId);
    }
}
