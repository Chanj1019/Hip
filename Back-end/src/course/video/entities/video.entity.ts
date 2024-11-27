import { IsOptional } from 'class-validator';
import { VideoTopic } from 'src/course/video_topic/entities/video_topic.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    video_id: number;

    @Column({ type: 'varchar', length: 255 })
    video_url: string;

    @Column()
    video_title: string;
    
    @ManyToOne(() => VideoTopic, (videotopic) => videotopic.videos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'video_topic_id' })
    videoTopic: VideoTopic;

    @Column()
    @IsOptional()
    Summary: string;
}
