import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, ManyToMany, ManyToOne, JoinColumn} from 'typeorm';
import { DocName } from '../../doc_name/entities/doc_name.entity'

@Entity()
export class CourseDoc {
    @PrimaryGeneratedColumn()
    course_document_id: number;

    @Column()
    course_id: number;

    @Column()
    course_document_title: string;

    // @CreateDateColumn()은 자동으로 생성 일자를 설정하는 데코레이터
    @CreateDateColumn()
    upload_date: Date; 
    
    @Column()
    file_path: string;

    @Column()
    course_document_description: string;

    @ManyToOne(() => DocName, (docname) => docname.courseDoc)
    @JoinColumn({name: 'doc_name_id'})
    docName: DocName;
  
}