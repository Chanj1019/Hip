import { Controller, Post, Get, Patch, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { VideoTopicService } from './video_topic.service';
import { UpdateVideoTopicDto } from './dto/update-video_topic.dto';
import { VideoTopic } from './entities/video_topic.entity';
import { VideoTopicResponseDto } from './dto/video_topic-response.dto';
import { CreateVideoTopicDto } from './dto/create-video_topic.dto';

@Controller('courses/:courseId/videoTopics')
export class VideoTopicController {
    constructor(private readonly videoTopicService: VideoTopicService) {}

    @Post('registerVT')
    async create(
        @Param('courseId') courseId: number,
        @Body() createVideoTopicDto: CreateVideoTopicDto
    ): Promise<{ message: string; data: VideoTopicResponseDto  }> {
        const data = await this.videoTopicService.create(courseId, createVideoTopicDto);
        return { message: "video topic 생성에 성공하셨습니다", data: data };
    }

    @Patch(':id/update')
    async update(
        @Param('courseId') courseId: number,
        @Param('id') video_topic_id: number,
        @Body() updateVideoTopicDto: UpdateVideoTopicDto
    ): Promise<{ message: string; data: VideoTopic }> {
        const data = await this.videoTopicService.update(courseId, video_topic_id, updateVideoTopicDto);
        return { message: "video topic 업데이트에 성공하셨습니다", data };
    }

    @Delete(':id/delete')
    async remove(
        @Param('courseId') courseId: number,
        @Param('id') video_topic_id: number
    ): Promise<{ message: string; data: VideoTopic }> {
        const data = await this.videoTopicService.remove(courseId, video_topic_id);
        if (!data) {
            throw new NotFoundException('VideoTopic not found');
        }
        return { message: "video topic 삭제에 성공하셨습니다", data };
    }

    // @Get('allVT')
    // async findAll(
    //     @Param('courseId') courseId: number
    // ): Promise<{ message: string; data: VideoTopic[] }> {
    //     const data = await this.videoTopicService.findAll(courseId);
    //     return { message: "전체 video topic 조회에 성공하셨습니다", data };
    // }

    // @Get('allVT2')
    // async findAll2(
    //     @Param('courseId') courseId: number
    // ): Promise<{ message: string; data1: VideoTopicResponseDto[], data2: VideoTopicResponseDto[] }> {
    //     const data1 = await this.videoTopicService.getTopicsWithNullPaTopicId(courseId);
    //     const data2 = await this.videoTopicService.getTopicsWithSpecificPaTopicId(courseId);
        
    //     return { message: 'Data retrieval successful', data1, data2 };
    // }
    
    // @Get(':id/read')
    // async findOne(
    //     @Param('courseId') courseId: number,
    //     @Param('id') video_topic_id: number
    // ): Promise<{ message: string; data: VideoTopic }> {
    //     const data = await this.videoTopicService.findOne(courseId, video_topic_id);
    //     if (!data) {
    //         throw new NotFoundException('VideoTopic not found');
    //     }
    //     return { message: "특정 video topic 조회에 성공하셨습니다", data };
    // }
}