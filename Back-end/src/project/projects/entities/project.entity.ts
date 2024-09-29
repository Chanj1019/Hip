import { Entity, Column, PrimaryGeneratedColumn, ManyToMany, OneToMany, JoinTable } from 'typeorm';
import { User } from '../../../user/user.entity';
import { ProjectDoc } from '../../project_doc/entities/project_doc.entity';
import { ProjectRegistration } from 'src/project/project_registration/entities/registration.entity';

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    project_id: number;

    @Column({ type: 'varchar', nullable: false, length: 100, unique: true })
    topic: string;

    @Column({ type: 'varchar', nullable: false, length: 50, unique: true })
    class: string;

    @Column({
        type: 'enum',
        enum: ['in_progress', 'completed'],
        default: 'in_progress',
    })
    project_status: 'in_progress' | 'completed';

    @Column({ type: 'varchar', length: 50, nullable: true })
    team_name: string;

    @Column({ type: 'varchar', length: 255, nullable: true })
    profile: string; // 파일의 경로 또는 URL

    @Column({ type: 'varchar', length: 255, nullable: true })
    requirements: string;

    // project - user
    @ManyToMany(() => User, (user) => user.projects)
    users: User[];

    // user_id를 저장하기 위한 userId 컬럼 추가
    @Column({ type: 'int', nullable: false })
    userId: number;

    // project - project_registration
    @OneToMany(() => ProjectRegistration, (project_registration) => project_registration.project)
    registrations: ProjectRegistration;

    // project - project_doc
    @OneToMany(() => ProjectDoc, (project_doc) => project_doc.project)
    project_docs: ProjectDoc[];
}
