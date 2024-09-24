import { VideoTopic } from 'src/course/video_topic/entities/video_topic.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Video {
    @PrimaryGeneratedColumn()
    video_id: number;

    @Column({ type: 'varchar', length: 100 })
    video_url: string;

    @ManyToOne(() => VideoTopic, (videotopic) => videotopic.videos, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'video_topic_id' })
    videoTopic: VideoTopic;
}
