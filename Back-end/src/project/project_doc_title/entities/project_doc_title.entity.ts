import { ProjectDoc } from 'src/project/project_doc/entities/project_doc.entity';
import { Feedback } from '../../feedback/entities/feedback.entity';
import { Project } from '../../projects/entities/project.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';

@Entity()
export class ProjectDocTitle {
    @PrimaryGeneratedColumn()
    project_doc_title_id: number;
    
    @Column({ type: 'varchar', length: 50 })
    project_doc_title: string;

    @Column({ nullable: true })
    project_doc_pa_title_id: number;

    @ManyToOne(() => ProjectDocTitle, (projectDocTitle) => projectDocTitle.subTitles, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'pa_title_id' })
    project_doc_pa_title: ProjectDocTitle;

    @OneToMany(() => ProjectDocTitle, (projectDocTitle) => projectDocTitle.project_doc_pa_title, {
        cascade: true
    })
    subTitles: ProjectDocTitle[];
    
    // project_doc_title - project
    @ManyToOne(() => Project, (project) => project.project_docs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' }) // 외래 키의 이름을 명시
    project: Project;

    // project_doc_title - project_doc
    @OneToMany(() => ProjectDoc, (projectDoc) => projectDoc.projectDocTitle, { cascade: true })
    project_docs: ProjectDoc[];
}