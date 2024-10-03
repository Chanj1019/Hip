import { Controller, Post, Get, Patch, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { VideoTopicService } from './video_topic.service';
import { CreateVideoTopicDto } from './dto/create-video_topic.dto';
import { UpdateVideoTopicDto } from './dto/update-video_topic.dto';

@Controller('courses/:courseId/videoTopics')
export class VideoTopicController {
    constructor(private readonly videoTopicService: VideoTopicService) {}

    @Post('registerVT')
    async create(
        @Param('courseId') courseId: number,
        @Body() createVideoTopicDto: CreateVideoTopicDto
    ) {
        const data = await this.videoTopicService.create(courseId, createVideoTopicDto);
        return { message: "video topic 생성에 성공하셨습니다", data };
    }

    @Get('allVT')
    async findAll(
        @Param('courseId') courseId: number
    ) {
        const data = await this.videoTopicService.findAll(courseId);
        return { message: "전체 video topic 조회에 성공하셨습니다", data };
    }

    @Get(':title')
    async findOne(
        @Param('courseId') courseId: number,
        @Param('title') video_topic_id: number
    ) {
        const data = await this.videoTopicService.findOne(courseId, video_topic_id);
        if (!data) {
            throw new NotFoundException('VideoTopic not found');
        }
        return { message: "특정 video topic 조회에 성공하셨습니다", data };
    }

    @Patch(':title')
    async update(
        @Param('courseId') courseId: number,
        @Param('title') video_topic_id: number,
        @Body() updateVideoTopicDto: UpdateVideoTopicDto
    ) {
        const data = await this.videoTopicService.update(courseId, video_topic_id, updateVideoTopicDto);
        return { message: "video topic 업데이트에 성공하셨습니다", data };
    }

    @Delete(':title')
    async remove(
        @Param('courseId') courseId: number,
        @Param('title') video_topic_id: number
    ) {
        const data = await this.videoTopicService.remove(courseId, video_topic_id);
        if (!data) {
            throw new NotFoundException('VideoTopic not found');
        }
        return { message: "video topic 삭제에 성공하셨습니다", data };
    }
}