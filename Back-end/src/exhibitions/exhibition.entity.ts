import { Entity, Column,ManyToOne,OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { User } from 'src/users/user.entity';
import { ExhibitionsDoc } from 'src/exhibitions_doc/entities/exhibitions_doc.entity';
import { ExhibitionsMember } from 'src/exhibitions_member/entities/exhibitions_member.entity';

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

    @ManyToOne(() => User, user => user.exhibitions) // User와의 관계 설정
    user: User; // 사용자 정보

    @OneToMany(() => ExhibitionsDoc, doc => doc.exhibition) // ExhibitionsDoc과의 관계 설정
    exhibitionsDocs: ExhibitionsDoc[]; // 전시 문서 목록

    @OneToMany(() => ExhibitionsMember, member => member.exhibitions) // ExhibitionsMember와의 관계 설정
    exhibitionsMembers: ExhibitionsMember[]; // 전시 참가자 목록

}
