import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinColumn, JoinTable } from 'typeorm';
import { User } from '../../../user/user.entity';
import { Project_doc } from '../../project_doc/entities/project_doc.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    project_id: number;

    @Column({ type: 'varchar', length: 50, nullable: false })
    team_name: string;

    @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
    title: string;

    @Column({
        type: 'enum',
        enum: ['in_progress', 'completed'],
        default: 'in_progress'
    })
    status: 'in_progress' | 'completed';

    //user-project
    @ManyToMany(() => User, (user) => user.projects)
    users: User[];

    //project-project_doc
    @OneToMany(() => Project_doc, (project_doc) => project_doc.project)
    @JoinTable()
    project_docs: Project_doc[];
}
