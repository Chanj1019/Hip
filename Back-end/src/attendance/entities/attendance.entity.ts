import { Course } from 'src/course/courses/entities/course.entity';
import { User } from 'src/user/user.entity';
import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';

@Entity('attendance')
export class Attendance {
    @PrimaryGeneratedColumn()
    attendance_id: number;

    @ManyToOne(() => Course, course => course.attendances)
    course: Course; // Course와의 관계

    @ManyToOne(() => User, user => user.attendances)
    user: User; // User와의 관계
    
    @Column()
    attendance_date: Date;

    @Column({
        type: 'enum',
        enum: ['present', 'absent', 'late'],
        default: 'absent',
    })
    field: 'present' | 'absent' | 'late';

    @Column()
    random_code: string; // 난수 저장
}
