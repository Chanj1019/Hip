import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../../user/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Registration } from '../../../enums/role.enum';
import { TeamRole } from '../../../enums/role.enum';

@Entity()
export class ProjectRegistration {
    @PrimaryGeneratedColumn()
    project_registration_id: number;

    @Column({ type: 'timestamp', nullable: false })
    reporting_date: Date;

    @Column({
        type: 'enum',
        enum: Registration,
        default: Registration.PENDING,
    })
    registration_status: Registration;

    @Column({ type: 'varchar', length: 50, nullable: true })
    project_role: string;

    @Column({
        type: 'enum',
        enum: TeamRole,
        default: TeamRole.MEMBER,
    })
    team_role: TeamRole;

    // project_registration - user
    @ManyToOne(() => User, (user) => user.project_registrations)
    @JoinColumn({ name: 'user_id' }) // 외래 키 지정
    user: User;

    // project_registration - project
    @ManyToOne(() => Project, (project) => project.project_registrations)
    @JoinColumn({ name: 'project_id' }) // 외래 키 지정
    project: Project;
}
