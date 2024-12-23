import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProjectDocTitle } from '../../project_doc_title/entities/project_doc_title.entity';

@Entity('feedback')
export class Feedback {
    @PrimaryGeneratedColumn()
    feedback_id: number;

    @Column()
    feedback_content: string;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;

    // feedback - project_doc
    @ManyToOne(() => ProjectDocTitle, (project_doc_title) => project_doc_title.feedbacks, { onDelete: 'CASCADE' })
    projectDoc: ProjectDocTitle;
}
