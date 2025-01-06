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

    @ManyToOne(() => ProjectDocTitle, (projectDocTitle) => projectDocTitle.sub_titles, {
        nullable: true,
        onDelete: 'CASCADE'
    })
    @JoinColumn({ name: 'project_doc_title_pa_id' })
    project_doc_title_pa_id: ProjectDocTitle;

    @OneToMany(() => ProjectDocTitle, (projectDocTitle) => projectDocTitle.project_doc_title_pa_id, {
        cascade: true
    })
    sub_titles: ProjectDocTitle[];
    
    // project_doc_title - project
    @ManyToOne(() => Project, (project) => project.project_docs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'project_id' }) // 외래 키의 이름을 명시
    project: Project;

    // project_doc_title - project_doc
    @OneToMany(() => ProjectDoc, (projectDoc) => projectDoc.projectDocTitle, { cascade: true })
    project_docs: ProjectDoc[];
}