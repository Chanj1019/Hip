import { Entity, Column, ManyToOne, OneToMany, PrimaryGeneratedColumn, JoinColumn } from 'typeorm';
import { User } from '../../user/user.entity';
import { ExhibitionDoc } from '../exhibitions_doc/entities/exhibition_doc.entity';
import { ExhibitionMember } from '../exhibitions_member/entities/exhibition_member.entity';
import { ExhibitionIntro } from '../exhibition_intro/entities/exhibition_intro.entity';

@Entity()
export class Exhibition {
    @PrimaryGeneratedColumn()
    exhibition_id: number;

    @Column()
    generation: string;

    @Column({ unique: true })
    exhibition_title: string;

    @Column()
    description: string;
    
    @Column({ type: 'timestamp' }) // timestamp 타입으로 설정
    exhibition_date: Date; // 날짜와 시간을 함께 저장

    
    @Column()
    file_path: string; // 파일 경로
    
    @Column()
    team_name: string; 

    @OneToMany(() => ExhibitionDoc, doc => doc.exhibition, { cascade: true }) 
    exhibitionDocs: ExhibitionDoc[];

    @OneToMany(() => ExhibitionMember, member => member.exhibition, { cascade: true })
    exhibitionMembers: ExhibitionMember[];

    @OneToMany(() => ExhibitionIntro, exhibitionIntro => exhibitionIntro.exhibition , {cascade:true})
    exhibitionIntros: ExhibitionIntro[];

    @ManyToOne(() => User, user => user.exhibition, {
        onDelete: 'CASCADE', // 사용자가 삭제될 때 전시도 삭제
    })
    @JoinColumn({ name: 'user_id' }) // 외래 키 설정
    user: User[]; // 사용자 정보
}
