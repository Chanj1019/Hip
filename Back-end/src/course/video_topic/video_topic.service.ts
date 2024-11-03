import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VideoTopic } from './entities/video_topic.entity';
import { CreateVideoTopicDto } from './dto/create-video_topic.dto';
import { UpdateVideoTopicDto } from './dto/update-video_topic.dto';
import { Course } from '../courses/entities/course.entity';
import { VideoTopicResponseDto } from './dto/video_topic-response.dto';

@Injectable()
export class VideoTopicService {
    constructor(
        @InjectRepository(VideoTopic)
        private readonly videoTopicRepository: Repository<VideoTopic>,
        @InjectRepository(Course)
        private readonly courseRepository: Repository<Course>,
    ) {}

    async create(
        courseId: number, 
        createVideoTopicDto: CreateVideoTopicDto
    ): Promise<VideoTopic> {
        const course = await this.courseRepository.findOne({ 
            where: { course_id: courseId }
        });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const videoTopic = this.videoTopicRepository.create({
            ...createVideoTopicDto
        });
        return await this.videoTopicRepository.save(videoTopic);
    }

    async findAll(
        courseId:  number
    ): Promise<VideoTopic[]> {
        const videoTopics = await this.videoTopicRepository.find({
            where: { course: { course_id: courseId } } // courseTitle을 사용하여 필터링
        });
        if (!videoTopics.length) {
            throw new NotFoundException("해당 강의의 비디오 주제가 없습니다.");
        }
        return videoTopics;
    }

    async findOne(
        courseId: number, 
        video_topic_id: number
    ): Promise<VideoTopic> {
        const videoTopic = await this.videoTopicRepository.findOne({
            where: { 
                course: { course_id: courseId }, 
                video_topic_id: video_topic_id
            }
        });
        if (!videoTopic) {
            throw new NotFoundException("비디오 주제를 찾을 수 없습니다.");
        }
        return videoTopic;
    }

    async update(
        courseId: number, 
        video_topic_id: number, 
        updateVideoTopicDto: UpdateVideoTopicDto
    ): Promise<VideoTopic> {
        const videoTopic = await this.findOne(courseId, video_topic_id);
        if (!videoTopic) {
            throw new NotFoundException("해당 비디오 주제를 찾을 수 없습니다.");
        }
        Object.assign(videoTopic, updateVideoTopicDto);
        return await this.videoTopicRepository.save(videoTopic);
    }

    async remove(
        courseId: number, 
        video_topic_id: number
    ): Promise<VideoTopic> {
        const videoTopic = await this.findOne(courseId, video_topic_id);
        if (!videoTopic) {
            throw new NotFoundException("해당 비디오 주제를 찾을 수 없습니다.");
        }
        await this.videoTopicRepository.remove(videoTopic);
        return videoTopic;
    }









    async getTopicsWithNullPaTopicId(
        courseId: number, 
    ): Promise<VideoTopicResponseDto[]> {
        const course = await this.courseRepository.findOne({ 
            where: { course_id: courseId }
        });
        if (!course) {
            throw new NotFoundException("해당 강의를 찾을 수 없습니다.");
        }
        const topics = await this.videoTopicRepository.find({
            select: ["video_topic_id"],
            where: { video_pa_topic_id: null },
        });
        return topics.map(topic => ({ video_topic_id: topic.video_topic_id } as VideoTopicResponseDto));
    }
    
    async getTopicsWithSpecificPaTopicId(
        paTopicId: number
    ): Promise<VideoTopicResponseDto[]> {
        const topics = await this.videoTopicRepository.find({
            select: ["video_topic_id"],
            where: { video_pa_topic_id: paTopicId },
        });
        return topics.map(topic => ({ video_topic_id: topic.video_topic_id } as VideoTopicResponseDto));
    }
    

}
