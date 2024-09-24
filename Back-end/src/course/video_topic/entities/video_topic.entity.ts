import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { Video } from 'src/course/video/entities/video.entity';

@Entity()
export class VideoTopic {
    @PrimaryGeneratedColumn()
    video_topic_id: number;

    @Column({ nullable: true })
    course_title: string;

    @Column({ type: 'varchar', length: 20 })
    video_topic_title: string;

    @Column({ nullable: true })
    video_pa_topic_title: string;
    
    // @ManyToOne(() => VideoTopic, videoTopic => VideoTopic.subTopics, { nullable: true })
    // @JoinColumn({ name: 'pa_topic_id' })
    // pa_topic: VideoTopic;

    // @OneToMany(() => VideoTopic, videoTopic => videoTopic.pa_topic)
    // subTopics: VideoTopic[];

    @ManyToOne(() => Course, course => course.videoTopic, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @OneToMany(() => Video, video => video.videoTopic, { cascade: true })
    videos: Video[];
}
