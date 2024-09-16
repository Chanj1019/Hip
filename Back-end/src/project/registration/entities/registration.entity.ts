import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { User } from '../../../user/user.entity';

export enum Status {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

@Entity()
export class Registration {
    @PrimaryGeneratedColumn()
    registration_id: number;

    @Column()
    status: Status;

    @Column()
    personnel: number;

    @ManyToOne(() => User, (user) => user.regstrations)
    user: User;

    // @ManyToOne(() => Course, (course) => course.registrations)
    // course: Course;

}
