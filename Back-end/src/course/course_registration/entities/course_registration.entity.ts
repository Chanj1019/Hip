import { Column, Entity, ManyToOne, PrimaryGeneratedColumn, JoinColumn } from "typeorm";
import { Registration } from "src/enums/role.enum";
import { Course } from "src/course/courses/entities/course.entity";
import { User } from "src/user/user.entity";

@Entity()
export class CourseRegistration {
    @PrimaryGeneratedColumn()
    course_registration_id: number;

    @Column({
        type: 'enum',
        enum: Registration,
        default: Registration.PENDING,
    })
    course_registration_status: Registration;

    @Column({ type: 'timestamp', nullable: false })
    course_reporting_date: Date;

    // course_registration - user
    @ManyToOne(() => User, (user) => user.course_registrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'userId' }) // 외래 키의 이름을 명시
    user: User;

    // course_registration - course
    @ManyToOne(() => Course, (course) => course.course_registrations, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'courseId' }) // 외래 키의 이름을 명시
    course: Course;
}
