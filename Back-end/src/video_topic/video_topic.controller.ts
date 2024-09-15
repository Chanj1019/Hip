import { Controller, Post, Get, Patch, Delete, Param, Query, Body, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { VideoTopicService } from './video_topic.service';
import { CreateVideoTopicDto } from './dto/create-video_topic.dto'; // CreateDocNameDto 임포트
import { UpdateVideoTopicDto } from './dto/update-video_topic.dto'; // UpdateDocNameDto 임포트

@Controller('courses/:courseTitle/videoTopic')
export class VideoTopicController {
    constructor(private readonly videoTopicService: VideoTopicService) {}

    @Post('register')
    async create(
        @Param('courseTitle') courseTitle: string,
        @Query('videoTopic') videoTopic: string,
        @Body() createVideoTopicDto: CreateVideoTopicDto
    ) {
        const data = await this.videoTopicService.create(courseTitle, videoTopic, createVideoTopicDto);
        return {
            message: "video topic 생성에 성공하셨습니다",
            data: data
        };
    }

    @Get()
    async findAll(
      @Query('videoTopic') videoTopic: string
    ) {
        const data = await this.videoTopicService.findAll(videoTopic);
        return {
            message: "전체 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Get(':videoTopic')
    async findOne(
      @Query('videoTopic') videoTopic: string
    ) {
        const data = await this.videoTopicService.findOne(videoTopic);
        return {
            message: "특정 강의의 doc_name 조회에 성공하셨습니다",
            data: data
        };
    }

    @Patch(':videoTopic')
    async update(
        @Param('courseTitle') courseTitle: string,
        @Param('videoTopic') videoTopic: string,
        @Body() updateVideoTopicDto: UpdateVideoTopicDto
    ) {
        const updatedData = await this.videoTopicService.update(courseTitle, videoTopic, updateVideoTopicDto);
        if (!updatedData) {
            throw new NotFoundException("비디오 주제를 찾을 수 없습니다.");
        }
        return {
            message: "video topic 업데이트에 성공하셨습니다",
            data: updatedData
        };
    }

    @Delete(':videoTopic')
    async remove(
        @Param('courseTitle') courseTitle: string,
        @Param('videoTopic') videoTopic: string
    ) {
        const deletedData = await this.videoTopicService.remove(courseTitle, videoTopic);
        if (!deletedData) {
            throw new NotFoundException("비디오 주제를 찾을 수 없습니다.");
        }
        return {
            message: "video topic 삭제에 성공하셨습니다",
            data: deletedData
        };
    }
}