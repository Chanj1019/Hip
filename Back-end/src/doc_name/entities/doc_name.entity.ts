import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { CourseDoc } from '../../course_doc/entities/course_doc.entity';

@Entity()
export class DocName {
    @PrimaryGeneratedColumn()
    topic_id: number;

    @Column()
    course_title: string;

    @Column({ nullable: true })
    pa_topic_title: string; // 부모 주제 ID, 소주제일 경우에만 값을 가짐.

    @Column()
    topic_title: string;

    @ManyToOne(() => Course, (course) => course.docName, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @OneToMany(() => CourseDoc, (coursedoc) => coursedoc.docName, { cascade: true })
    courseDoc: CourseDoc[];
}
