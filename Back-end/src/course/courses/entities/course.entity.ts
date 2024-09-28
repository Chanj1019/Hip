import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { DocName } from '../../doc_name/entities/doc_name.entity';
import { VideoTopic } from 'src/course/video_topic/entities/video_topic.entity';
import { User } from 'src/user/user.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    course_id: number;

    @Column({ type: 'varchar', length: 10, unique: true })
    course_title: string;

    @Column({ type: 'varchar', length: 100 })
    description: string;
    
    @Column({ type: 'varchar', length: 40 })
    instructor_name: string;

    @Column({ type: 'varchar', length: 100, nullable:true })
    course_notice: string;

    @ManyToMany(() => User, (user) => user.course)
    user: User[];

    @OneToMany(() => DocName, (docname) => docname.course, { cascade: true })
    docName: DocName[];

    @OneToMany(() => VideoTopic, (videoTopic) => videoTopic.course, { cascade: true })
    videoTopic: VideoTopic[];

}