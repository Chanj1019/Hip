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

    async create(courseTitle: string, videoTopicTitle: string, createVideoTopicDto: CreateVideoTopicDto): Promise<VideoTopic> {
        const course = await this.courseRepository.findOne({ where: { course_title: courseTitle } });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }

        const videoTopic = this.videoTopicRepository.create({
            ...createVideoTopicDto,
            course,
            video_topic_title: videoTopicTitle,
        });

        return await this.videoTopicRepository.save(videoTopic);
    }

    async findAll(videoTopicTitle?: string): Promise<VideoTopic[]> {
        const query = this.videoTopicRepository.createQueryBuilder('videoTopic');

        if (videoTopicTitle) {
            query.where('videoTopic.video_topic_title LIKE :title', { title: `%${videoTopicTitle}%` });
        }

        return await query.getMany();
    }

    async findOne(videoTopicTitle: string): Promise<VideoTopic> {
        const videoTopic = await this.videoTopicRepository.findOne({
            where: { video_topic_title: videoTopicTitle },
        });

        if (!videoTopic) {
            throw new NotFoundException("비디오 주제를 찾을 수 없습니다.");
        }

        return videoTopic;
    }

    async update(courseTitle: string, videoTopicTitle: string, updateVideoTopicDto: UpdateVideoTopicDto): Promise<VideoTopic> {
        const videoTopic = await this.findOne(videoTopicTitle);

        if (courseTitle !== videoTopic.course.course_title) {
            throw new NotFoundException("해당 강의의 비디오 주제를 찾을 수 없습니다.");
        }

        Object.assign(videoTopic, updateVideoTopicDto);
        return await this.videoTopicRepository.save(videoTopic);
    }

    async remove(courseTitle: string, videoTopicTitle: string): Promise<VideoTopic> {
        const videoTopic = await this.findOne(videoTopicTitle);

        if (courseTitle !== videoTopic.course.course_title) {
            throw new NotFoundException("해당 강의의 비디오 주제를 찾을 수 없습니다.");
        }

        await this.videoTopicRepository.remove(videoTopic);
        return videoTopic;
    }
}
