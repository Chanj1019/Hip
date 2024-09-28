import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { Registration } from "src/enums/role.enum";

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
}
