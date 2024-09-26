import { Feedback } from '../../feedback/entities/feedback.entity';
import { Project } from '../../projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class ProjectDoc {
    @PrimaryGeneratedColumn()
    project_doc_id: number;

    @Column({ type: 'varchar', length: 255 })
    description: string;

    @Column({ type: 'varchar', length: 255 })
    file_path: string; // 파일 경로

    // project_doc - project
    @ManyToOne(() => Project, (project) => project.project_docs)
    @JoinColumn({ name: 'projectId' }) // 외래 키의 이름을 명시
    project: Project;

    @Column({ type: 'int', nullable: false })
    projectId: number;

    // project_Doc - feedback
    @OneToMany(() => Feedback, (feedback) => feedback.projectDoc)
    feedbacks: Feedback[];
}