import { Entity, Column,ManyToOne,OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ExhibitionDoc } from 'src/exhibitions_doc/entities/exhibition_doc.entity';
import { ExhibitionMember } from 'src/exhibitions_member/entities/exhibition_member.entity';

@Entity()
export class Exhibition {
    @PrimaryGeneratedColumn()
    exhibition_id: number;

    @Column()
    generation: string;

    @Column()
    exhibition_title: string;

    @Column()
    description: string;
    
    @Column({ type: 'timestamp' }) // timestamp 타입으로 설정
    exhibition_date: Date; // 날짜와 시간을 함께 저장

    @ManyToOne(() => User, user => user.exhibition) // User와의 관계 설정
    user: User; // 사용자 정보

    @OneToMany(() => ExhibitionDoc, doc => doc.exhibition) // ExhibitionsDoc과의 관계 설정
    exhibitionDocs: ExhibitionDoc[]; // 전시 문서 목록

    @OneToMany(() => ExhibitionMember, member => member.exhibition) // ExhibitionsMember와의 관계 설정
    exhibitionMembers: ExhibitionMember[]; // 전시 참가자 목록

    
   
}
