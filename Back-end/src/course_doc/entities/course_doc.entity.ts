import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DocName } from '../../doc_name/entities/doc_name.entity';

@Entity()
export class CourseDoc {
    @PrimaryGeneratedColumn()
    course_document_id: number;

    @CreateDateColumn()
    upload_date: Date; 
    
    @Column()
    file_path: string;

    @ManyToOne(() => DocName, (docname) => docname.courseDoc, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doc_name_id' })
    docName: DocName;
}
