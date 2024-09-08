import { Feedback } from 'src/feedback/entities/feedback.entity';
import { Project } from '../../projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany } from 'typeorm';

@Entity()
export class Project_doc {
    @PrimaryGeneratedColumn()
    project_doc_id: number;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column()
    file_path: string; // 파일 경로

    // project_doc - project
    @ManyToOne(() => Project, (project) => project.project_docs)
    project: Project;

    // project_Doc - feedback
    @OneToMany(() => Feedback, (feedback) => feedback.projectDoc)
    feedbacks: Feedback;
}