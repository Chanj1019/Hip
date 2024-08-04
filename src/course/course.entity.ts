import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  course_id: number;

  @Column()
  course_title: number;

  @Column()
  description: string;

  @Column()
  instructor_id: number;

  @Column()
  start_date: Date;

  @Column()
  end_date: Date;

  @Column()
  course_notice: string;
}
