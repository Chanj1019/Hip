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
    @ManyToOne(() => User, (user) => user.course_registrations)
    @JoinColumn({ name: 'userId' }) // 외래 키의 이름을 명시
    user: User;

    @Column({ type: 'int', nullable: false })
    userId: number;

    // course_registration - course
    @ManyToOne(() => Course, (course) => course.course_registrations)
    @JoinColumn({ name: 'coursetId' }) // 외래 키의 이름을 명시
    course: Course;

    @Column({ type: 'int', nullable: false })
    courseId: number;
}
