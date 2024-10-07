
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToMany, JoinTable } from 'typeorm';
import { ProjectRegistration } from '../project/project_registration/entities/registration.entity';
import { Project } from '../project/projects/entities/project.entity';
import { Role } from '../enums/role.enum';
import { Exhibition } from '../exhibition/exhibitions/exhibition.entity';
import { Course } from 'src/course/courses/entities/course.entity';
import { CourseRegistration } from 'src/course/course_registration/entities/course_registration.entity';
import { Attendance } from 'src/attendance/entities/attendance.entity';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column({ type: 'varchar', length: 18 })
    user_name: string;

    @Column({ type: 'varchar', length: 50, nullable: false, unique: true })
    id: string;

    @Column({ type: 'varchar', length: 255, nullable: false })
    password: string;

    @Column()
    email: string;


    @Column({
        type: 'enum',
        enum: Role,
        nullable: false,
    })

    user_role: Role; // Role 타입으로 변경

    @ManyToMany(() => Course, course => course.user)
    @JoinTable()
    course: Course[];

    @OneToMany(() => Exhibition, exhibition => exhibition.user,{ cascade: true })
    exhibition: Exhibition[];

    @Column({ type: 'varchar', length: 100, unique: true, nullable: false })
    nick_name: string;
    
    // user - project 연결 추가
    @ManyToMany(() => Project, (project) => project.users)
    @JoinTable() 
    projects: Project[];

    // user - project_registration 연결 추가
    @OneToMany(() => ProjectRegistration, (project_registration) => project_registration.user)
    project_registrations: ProjectRegistration[];

    // user - course_registration  연결 추가
    @OneToMany(() => CourseRegistration, (course_registration) => course_registration.user)
    course_registrations: CourseRegistration[];

    // 학생이 출석 기록을 가질 수 있는 관계 설정
    @OneToMany(() => Attendance, attendance => attendance.user)
    attendances: Attendance[];
}

