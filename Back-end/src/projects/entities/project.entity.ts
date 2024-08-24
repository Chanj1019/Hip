import { Entity, Column, PrimaryGeneratedColumn, ManyToMany } from 'typeorm';
import { User } from '../../users/user.entity';

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

    @ManyToMany(() => User, (user) => user.projects)
    users: User[];

}
