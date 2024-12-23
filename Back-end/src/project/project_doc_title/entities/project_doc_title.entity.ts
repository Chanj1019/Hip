import { Feedback } from '../../feedback/entities/feedback.entity';
import { Project } from '../../projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class ProjectDocTitle {
    @PrimaryGeneratedColumn()
    project_doc_id: number;
    
    @Column({ type: 'varchar', length: 50 })
    title: string;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    file_path: string; // 파일 경로

    // project_doc - project
    @ManyToOne(() => Project, (project) => project.project_docs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' }) // 외래 키의 이름을 명시
    project: Project;

    // project_Doc - feedback
    @OneToMany(() => Feedback, (feedback) => feedback.projectDoc, { cascade: true })
    feedbacks: Feedback[];
}