import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoTopic } from './entities/video_topic.entity';
import { CreateVideoTopicDto } from './dto/create-video_topic.dto';
import { UpdateVideoTopicDto } from './dto/update-video_topic.dto';
import { Course } from '../courses/entities/course.entity';

@Injectable()
export class VideoTopicService {
    constructor(
        @InjectRepository(VideoTopic)
        private readonly videoTopicRepository: Repository<VideoTopic>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async create(
        courseTitle: string, 
        createVideoTopicDto: CreateVideoTopicDto
    ): Promise<VideoTopic> {
        const course = await this.courseRepository.findOne({ 
            where: { course_title: courseTitle }
        });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const videoTopic = this.videoTopicRepository.create({
            ...createVideoTopicDto,
            course
        });
        return await this.videoTopicRepository.save(videoTopic);
    }

    async findAll(
        courseTitle: string
    ): Promise<VideoTopic[]> {
        const videoTopics = await this.videoTopicRepository.find({
            where: { course: { course_title: courseTitle } } // courseTitle을 사용하여 필터링
        });
        if (!videoTopics.length) {
            throw new NotFoundException("해당 강의의 비디오 주제가 없습니다.");
        }
        return videoTopics;
    }

    async findOne(
        courseTitle: string, 
        video_topic_title: string
    ): Promise<VideoTopic> {
        const videoTopic = await this.videoTopicRepository.findOne({
            where: { 
                course: { course_title: courseTitle }, 
                video_topic_title: video_topic_title 
            }
        });
        if (!videoTopic) {
            throw new NotFoundException("비디오 주제를 찾을 수 없습니다.");
        }
        return videoTopic;
    }

    async update(
        courseTitle: string, 
        video_topic_title: string, 
        updateVideoTopicDto: UpdateVideoTopicDto
    ): Promise<VideoTopic> {
        const videoTopic = await this.findOne(courseTitle, video_topic_title);
        if (!videoTopic) {
            throw new NotFoundException("해당 비디오 주제를 찾을 수 없습니다.");
        }
        Object.assign(videoTopic, updateVideoTopicDto);
        return await this.videoTopicRepository.save(videoTopic);
    }

    async remove(
        courseTitle: string, 
        video_topic_title: string)
        : Promise<VideoTopic> {
        const videoTopic = await this.findOne(courseTitle, video_topic_title);
        if (!videoTopic) {
            throw new NotFoundException("해당 비디오 주제를 찾을 수 없습니다.");
        }
        await this.videoTopicRepository.remove(videoTopic);
        return videoTopic;
    }
}
