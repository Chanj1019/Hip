import { Project } from '../../projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity()
export class Project_doc {
    @PrimaryGeneratedColumn()
    project_doc_id: number;

    @Column({ type: 'varchar', length: 255 })
    project_material: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @ManyToOne(() => Project, (project) => project.project_docs)
    project: Project;
}