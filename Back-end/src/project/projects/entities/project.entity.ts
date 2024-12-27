import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { User } from '../../../user/user.entity';
import { ProjectDocTitle } from '../../project_doc_title/entities/project_doc_title.entity';
import { ProjectRegistration } from 'src/project/project_registration/entities/registration.entity';
import { ProjectKeyDoc } from 'src/project/project_key_doc/entities/project_key_doc.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    project_id: number;

    @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
    topic: string;

    @Column({ type: 'varchar', nullable: false, length: 50 })
    className: string;
    
    @Column({
        type: 'enum',
        enum: ['in_progress', 'completed'],
        default: 'in_progress',
    })
    project_status: 'in_progress' | 'completed';

    @Column({ type: 'varchar', length: 50, nullable: true, unique: true })
    team_name: string;

    @Column({ type: 'varchar', length: 10, nullable: false })
    generation: string;

    // project - user
    @ManyToMany(() => User, (user) => user.projects)
    users: User[];

    // project - project_registration
    @OneToMany(() => ProjectRegistration, (project_registration) => project_registration.project, { cascade: true })
    project_registrations: ProjectRegistration;

    // project - project_doc
    @OneToMany(() => ProjectDocTitle, (project_doc_title) => project_doc_title.project, { cascade: true })
    project_docs: ProjectDocTitle[];

    // project - project_key_doc
    @OneToMany(() => ProjectKeyDoc, (project_key_doc) => project_key_doc.project, { cascade: true })
    keyDocs: ProjectKeyDoc[];
}
