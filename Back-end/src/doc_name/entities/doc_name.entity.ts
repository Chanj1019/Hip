import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Course } from '../../courses/entities/course.entity'
import { CourseDoc } from '../../course_doc/entities/course_doc.entity'

@Entity()
export class DocName {
    @PrimaryGeneratedColumn()
    topic_id: number;

    @Column()
    course_id: number;

    @Column()
    pa_topic_id: number;

    @Column()
    file_path: string;

    @ManyToOne(() => Course, (course) => course.docName, { onDelete: 'CASCADE'})
    @JoinColumn({ name: 'course_id' })
    course: Course;

    @OneToMany(() => CourseDoc, (coursedoc) => coursedoc.docName, { cascade: true })
    courseDoc: CourseDoc[];
}