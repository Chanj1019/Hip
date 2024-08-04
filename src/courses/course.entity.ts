// course.entity.ts
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Course {
  @PrimaryGeneratedColumn()
  course_id: number;

  @Column()
  course_title: string;

  @Column()
  description: string;

  @Column()
  instructor_id: number;

  // @Column({type: 'timestamp'})
  // start_date: Date;

  // @Column({type: 'timestamp'})
  // end_date: Date;

  // @Column({ nullable: true })
  // course_notice: string;
}
