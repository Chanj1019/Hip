import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';
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
        default: TeamRole.MEMBER,
    })
    team_role: TeamRole;

    // 관계

    // project_registration - user
    @ManyToOne(() => User, (user) => user.project_registrations)
    @JoinColumn({ name: 'userId' }) // 외래 키의 이름을 명시
    user: User;

    // user_id를 참조한 값을 데이터베이스에 저장하기 위한 컬럼
    @Column({ type: 'int', nullable: false })
    userId: number;

    // project_registration - project
    @ManyToOne(() => Project, (project) => project.project_registrations)
    @JoinColumn({ name: 'projectId' }) // 외래 키의 이름을 명시
    project: Project;

    // project_id를 참조한 값을 데이터베이스에 저장하기 위한 컬럼
    @Column({ type: 'int', nullable: false })
    projectId: number;
}
