import { Controller, Post, Get, Patch, Delete, Param, Body, NotFoundException } from '@nestjs/common';
import { VideoTopicService } from './video_topic.service';
import { CreateVideoTopicDto } from './dto/create-video_topic.dto';
import { UpdateVideoTopicDto } from './dto/update-video_topic.dto';

@Controller('courses/:courseTitle/videoTopics')
export class VideoTopicController {
    constructor(private readonly videoTopicService: VideoTopicService) {}

    @Post('registerVT')
    async create(
        @Param('courseTitle') courseTitle: string,
        @Body() createVideoTopicDto: CreateVideoTopicDto
    ) {
        const data = await this.videoTopicService.create(courseTitle, createVideoTopicDto);
        return { message: "video topic 생성에 성공하셨습니다", data };
    }

    @Get('allVT')
    async findAll(
        @Param('courseTitle') courseTitle: string
    ) {
        const data = await this.videoTopicService.findAll(courseTitle);
        return { message: "전체 video topic 조회에 성공하셨습니다", data };
    }

    @Get(':title')
    async findOne(
        @Param('courseTitle') courseTitle: string,
        @Param('title') video_topic_title: string
    ) {
        const data = await this.videoTopicService.findOne(courseTitle, video_topic_title);
        if (!data) {
            throw new NotFoundException('VideoTopic not found');
        }
        return { message: "특정 video topic 조회에 성공하셨습니다", data };
    }

    @Patch(':title')
    async update(
        @Param('courseTitle') courseTitle: string,
        @Param('title') video_topic_title: string,
        @Body() updateVideoTopicDto: UpdateVideoTopicDto
    ) {
        const data = await this.videoTopicService.update(courseTitle, video_topic_title, updateVideoTopicDto);
        return { message: "video topic 업데이트에 성공하셨습니다", data };
    }

    @Delete(':title')
    async remove(
        @Param('courseTitle') courseTitle: string,
        @Param('title') video_topic_title: string
    ) {
        const data = await this.videoTopicService.remove(courseTitle, video_topic_title);
        if (!data) {
            throw new NotFoundException('VideoTopic not found');
        }
        return { message: "video topic 삭제에 성공하셨습니다", data };
    }
}