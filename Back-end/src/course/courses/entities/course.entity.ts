import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany } from 'typeorm';
import { DocName } from '../../doc_name/entities/doc_name.entity';
import { VideoTopic } from 'src/course/video_topic/entities/video_topic.entity';
import { User } from 'src/user/user.entity';
import { CourseRegistration } from 'src/course/course_registration/entities/course_registration.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    course_id: number;

    @Column({ type: 'varchar', length: 30, unique: true })
    course_title: string;

    @Column({ type: 'varchar', length: 100 })
    description: string;
    
    @Column({ type: 'varchar', length: 40 })
    instructor_name: string;

    @Column({ type: 'varchar', length: 100, nullable:true })
    course_notice: string;

    @Column({ type: 'varchar', length: 10, nullable: false, default: '3기'})
    generation: string;

    @ManyToMany(() => User, (user) => user.course)
    user: User[];

    @OneToMany(() => DocName, (docname) => docname.course, { cascade: true })
    docName: DocName[];

    @OneToMany(() => VideoTopic, (videoTopic) => videoTopic.course, { cascade: true })
    videoTopic: VideoTopic[];

    // course - course_registration
    @OneToMany(() => CourseRegistration, (course_registration) => course_registration.course, { cascade: true })
    course_registrations: CourseRegistration[];

    @OneToMany(() => Attendance, attendance => attendance.course)
    attendances: Attendance[];

}