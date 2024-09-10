import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { UCat} from '../../ucat/entities/ucat.entity';
import { create } from 'domain';
import { DocName } from '../../doc_name/entities/doc_name.entity';

@Entity()
export class Course {
    @PrimaryGeneratedColumn()
    course_id: number;

    @Column()
    course_title: string;

    @Column()
    description: string;
    
    @Column()
    instructor_name: string;

    @Column({nullable:true})
    course_notice: string;

    @OneToMany(() => UCat, (ucat) => ucat.course, { cascade: true })
    uCats: UCat[];

    @OneToMany(() => DocName, (docname) => docname.course, { cascade: true })
    docName: DocName[];

}