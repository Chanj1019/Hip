import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { Course } from '../../courses/entities/course.entity';
import { CourseDoc } from '../../../course/course_doc/entities/course_doc.entity';

@Entity()
export class DocName {
    @PrimaryGeneratedColumn()
    topic_id: number;

    @Column({ type: 'varchar', length: 20 })
    topic_title: string;

    @Column({ nullable: true })
    pa_topic_id: number;
    
    @ManyToOne(() => DocName, docName => docName.subTopics, { 
        nullable: true,
        onDelete: 'CASCADE'  // This will handle the foreign key constraint
    })
    @JoinColumn({ name: 'pa_topic_id' })
    pa_topic: DocName;

    @OneToMany(() => DocName, docName => docName.pa_topic, { 
        cascade: true  // Change to true to cascade all operations
    })
    subTopics: DocName[];

    @ManyToOne(() => Course, course => course.docName, { onDelete: 'CASCADE' })
    @JoinColumn()
    course: Course;

    @OneToMany(() => CourseDoc, courseDoc => courseDoc.docName, { cascade: true })
    courseDocs: CourseDoc[];
}
