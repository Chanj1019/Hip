import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UCat} from '../../ucat/entities/ucat.entity';
@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    course_id: number;

    @Column()
    student_id: number;

    @Column()
    course_title: string;

    @Column()
    description: string;
    
    @Column()
    instructor_id: number;

    @Column()
    course_notice: string;

    @OneToMany(() => UCat, (ucat) => ucat.course)
    uCats: UCat[];
}