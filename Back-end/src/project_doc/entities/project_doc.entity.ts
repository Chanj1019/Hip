import { Project } from '../../projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Project_doc {
    @PrimaryGeneratedColumn()
    project_doc_id: number;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column()
    file_path: string; // 파일 경로

    @ManyToOne(() => Project, (project) => project.project_docs)
    project: Project;
}