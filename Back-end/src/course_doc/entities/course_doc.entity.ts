import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DocName } from '../../doc_name/entities/doc_name.entity';

@Entity()
export class CourseDoc {
    @PrimaryGeneratedColumn()
    course_document_id: number;

    @Column()
    doc_name_id: number; // 주제 ID (Foreign Key)

    @Column()
    course_document_title: string;

    @CreateDateColumn()
    upload_date: Date; 
    
    @Column()
    file_path: string;

    @Column()
    course_document_description: string;

    @ManyToOne(() => DocName, (docname) => docname.courseDoc, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doc_name_id' })
    docName: DocName;
}
