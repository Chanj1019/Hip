import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../../user/user.entity';
import { Project } from '../../projects/entities/project.entity';
import { Registration } from '../../../enums/role.enum';
import { TeamRole } from '../../../enums/role.enum';

@Entity()
export class ProjectRegistration {
    @PrimaryGeneratedColumn()
    registration_id: number;

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
    })
    team_role: TeamRole;

    // project_registration - user
    @ManyToOne(() => User, (user) => user.registrations)
    user: User;

    // project_registration - project
    @ManyToOne(() => Project, (project) => project.registrations)
    project: Project;

}
