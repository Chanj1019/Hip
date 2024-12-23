import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { Project } from '../../projects/entities/project.entity';

@Entity()
export class ProjectKeyDoc {
    @PrimaryGeneratedColumn()
    key_doc_id: number;

    @Column()
    key_doc_title: string;

    @Column()
    key_doc_url: string;

    @Column()
    key_doc_category: string;

    @ManyToOne(() => Project, project => project.keyDocs)
    project: Project;
}
