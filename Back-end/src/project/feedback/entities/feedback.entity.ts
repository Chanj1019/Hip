import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { ProjectDoc } from '../../../project/project_doc/entities/project_doc.entity';

@Entity('feedback')
export class Feedback {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    // feedback - project_doc
    @ManyToOne(() => ProjectDoc, (project_doc) => project_doc.feedbacks)
    projectDoc: ProjectDoc;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    createdAt: Date;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' })
    updatedAt: Date;
}
