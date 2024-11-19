import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { DocName } from '../../doc_name/entities/doc_name.entity';

@Entity()
export class CourseDoc {
    @PrimaryGeneratedColumn()
    course_document_id: number;

    @CreateDateColumn({ nullable: true })
    upload_date: Date; 
    
    @Column({ type: 'varchar', length: 100 })
    file_path: string;

    @Column({ type: 'varchar', length: 100 })
    file_name: string;

    @ManyToOne(() => DocName, (docname) => docname.courseDocs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'doc_name_id' })
    docName: DocName;
}
