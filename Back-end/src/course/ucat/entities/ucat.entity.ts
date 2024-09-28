// import { User } from '../../../user/user.entity';
// import { Course } from '../../courses/entities/course.entity';
// import { Entity, PrimaryGeneratedColumn, ManyToOne, JoinColumn } from 'typeorm';

// @Entity()
// export class UCat {
//     @PrimaryGeneratedColumn()
//     id: number;

//     @ManyToOne(() => User, (user) => user.uCatsAsStudent)
//     @JoinColumn({ name: 'student_id' })
//     student: User;

//     @ManyToOne(() => User, (user) => user.uCatsAsInstructor)
//     @JoinColumn({ name: 'instructor_id' })
//     instructor: User;

//     @ManyToOne(() => Course, (course) => course.uCats)
//     @JoinColumn({ name: 'course_id' })
//     course: Course;
// }
