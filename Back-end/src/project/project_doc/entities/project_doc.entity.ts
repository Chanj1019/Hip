import { Feedback } from 'src/project/feedback/entities/feedback.entity';
import { ProjectDocTitle } from 'src/project/project_doc_title/entities/project_doc_title.entity';
import { Column, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

export class ProjectDoc {
    @PrimaryGeneratedColumn()
    project_doc_id: number;
    
    @Column({ type: 'varchar', length: 255 })
    url: string;

    @Column({ type: 'varchar', length: 20 })
    title: string;
    
    @ManyToOne(() => ProjectDocTitle, (projectDocTitle) => projectDocTitle.project_docs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectDocTitleId' })
    projectDocTitle: ProjectDocTitle;

    @OneToMany(() => Feedback, (feedback) => feedback.projectDoc, { cascade: true })
    feedbacks: Feedback[];
}