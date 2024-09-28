import { Injectable, NotFoundException, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { Course } from '../courses/entities/course.entity';
import { VideoTopic } from '../video_topic/entities/video_topic.entity';
import { Video } from './entities/video.entity';
import { v4 as uuidv4 } from 'uuid';
import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { Response } from 'express';
import { Readable } from 'stream';

@Injectable()
export class VideoService {
    private s3: S3Client;
    constructor(
        @InjectRepository(Course)
        private readonly coursesRepository: Repository<Course>,
        @InjectRepository(VideoTopic)
        private readonly videoTopicRepository: Repository<VideoTopic>,
        @InjectRepository(Video)
        private readonly videoRepository: Repository<Video>
    ){
        const AWS_ACCESS_KEY_ID = process.env.AWS_ACCESS_KEY_ID;
        const AWS_SECRET_ACCESS_KEY = process.env.AWS_SECRET_ACCESS_KEY;
        const AWS_REGION = process.env.AWS_REGION;

        this.s3 = new S3Client({
            region: AWS_REGION,
            credentials: {
            accessKeyId: AWS_ACCESS_KEY_ID,
            secretAccessKey: AWS_SECRET_ACCESS_KEY,
          },
        });
    }

    private async validate(
        courseTitle: string, 
        videoTopicId: number,
    ): Promise<void> {
        const CourseTitle = await this.coursesRepository.findOne({
            where: { course_title: courseTitle }
        })
        if (!CourseTitle) {
            throw new NotFoundException('강의를 찾을 수 없습니다.')
        }
        const VideoTopic = await this.videoTopicRepository.findOne({
            where: { video_topic_id :videoTopicId }
        })
        if (!VideoTopic) {
            throw new NotFoundException('비디오 주제를 찾을 수 없습니다.')
        }
    }

    // async create(
    //     courseTitle: string, 
    //     videoTopicId: number, 
    //     createVideoDto: CreateVideoDto
    // ): Promise<Video> {
    //     await this.validate(courseTitle, videoTopicId);
    //     const video = this.videoRepository.create({ 
    //         ...createVideoDto 
    //     })
    //     return this.videoRepository.save(video);
    // } 

    // async findAll(
    //     courseTitle: string, 
    //     videoTopicId: number, 
    // ): Promise<Video[]> {
    //     await this.validate(courseTitle, videoTopicId);
    //     return await this.videoRepository.find();
    // }

    // async findOne(
    //     courseTitle: string, 
    //     videoTopicId: number, 
    //     id: number
    // ): Promise<Video> {
    //     await this.validate(courseTitle, videoTopicId);
    //     const video = await this.videoRepository.findOne({
    //         where: { video_id: id }
    //     })
    //     return video;
    // }

    // async update(
    //     courseTitle: string, 
    //     videoTopicId: number, 
    //     id: number, 
    //     updateVideoDto: UpdateVideoDto
    // ): Promise<Video> {
    //     const video = await this.findOne(courseTitle, videoTopicId, id);
    //     await this.videoRepository.update(video.video_id, updateVideoDto);
    //     return this.findOne(courseTitle, videoTopicId, video.video_id);
    // } // 바뀐 객체 반환
    

    // async remove(
    //     courseTitle: string, 
    //     videoTopicId: number, 
    //     id: number
    // ): Promise<Video> {
    //     const video = await this.findOne(courseTitle, videoTopicId, id);
    //     await this.videoRepository.remove(video);
    //     return video; // 삭제된 비디오 객체를 반환
    // }

    async streamVideo(
        video_id: number,
        res: Response
    ): Promise<void> {
        const video = await this.videoRepository.findOne({
            where: { video_id }
        });

        if (!video || !video.video_url) {
            throw new NotFoundException('비디오를 찾을 수 없습니다.');
        }

        const bucketName = process.env.AWS_S3_BUCKET_NAME;
        if (!bucketName) {
            throw new Error('AWS S3 bucket name is not configured');
        }

        try {
            const command = new GetObjectCommand({
                Bucket: bucketName,
                Key: video.video_url,
            });

            const data = await this.s3.send(command);
            const stream = data.Body as Readable; // 타입을 Readable로 명시적으로 지정

            if (!stream) {
                throw new Error('파일 스트림을 가져올 수 없습니다.');
            }
            res.setHeader('Content-Type', 'video/mp4'); // MIME 타입 설정
            res.setHeader('Accept-Ranges', 'bytes'); // 바이트 범위 수신 허용

            // 스트리밍을 위해 파이프하기
            stream.pipe(res);
        } catch (error) {
            console.error('비디오 스트리밍 실패:', error);
            throw new InternalServerErrorException(`비디오 스트리밍에 실패했습니다: ${error.message}`);
        }
    }
    
    async uploadFile(
        courseTitle: string,
        videoTopicId: number,
        file: Express.Multer.File
    ): Promise<{ message: string }> {
        await this.validate(courseTitle, videoTopicId);

        const fileName = `${uuidv4()}-${file.originalname}`;
        const bucketName = process.env.AWS_S3_BUCKET_NAME; // 한 줄 수정

        if (!bucketName) {
            throw new Error('AWS S3 bucket name is not configured');
        }

        try {
            // PutObjectCommand: S3에 업로드하기 위한 명령어
            const command = new PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: file.buffer,
                ContentType: file.mimetype,
            });
            await this.s3.send(command);
            const url = `${fileName}`; // 저장할 객체 키 명시적으로 작성
            
            await this.saveFile(url);
            return { message: '성공적으로 업로드하셨습니다.' };

        } catch (error) {
            console.error('File upload failed:', error);
            throw new InternalServerErrorException(`파일 업로드에 실패했습니다: ${error.message}`);
        }
    }

    async saveFile(
        video_url: string
    ): Promise<void> {
        try {
            // Create video entity with relations to course and video topic
            const video = this.videoRepository.create({
                video_url
            });
            // Save video entity
            await this.videoRepository.save(video);
        } catch (error) {
            console.error('File save error:', error);
            throw new BadRequestException(`파일 URL 저장에 실패했습니다: ${error.message}`);
        }
    }

    async removeFile(
        video_id: number
    ): Promise<void> {
        const video = await this.videoRepository.findOne({
            where: { video_id }
        });
        
        if (!video || !video.video_url) {
            throw new NotFoundException('삭제할 파일이 없습니다.');
        }
        
        const bucketName = process.env.AWS_S3_BUCKET_NAME; // 한 줄 수정
        if (!bucketName) {
            throw new Error('AWS S3 bucket name is not configured');
        }
        
        try {
            const command = new DeleteObjectCommand({
                Bucket: bucketName,
                Key: video.video_url, // S3에 저장된 파일의 키를 사용하여 삭제
            });
            await this.s3.send(command);
        
            await this.videoRepository.remove(video);
        } catch (error) {
            console.error('File deletion failed:', error);
            throw new InternalServerErrorException(`파일 삭제에 실패했습니다: ${error.message}`);
        }
    }
}


