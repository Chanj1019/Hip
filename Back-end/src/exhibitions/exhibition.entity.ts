import { Entity, Column,ManyToOne,OneToMany, PrimaryGeneratedColumn ,} from 'typeorm';

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

    @OneToMany(() => ExhibitionDoc, doc => doc.exhibition, { cascade: true }) 
    exhibitionDocs: ExhibitionDoc[];

    @OneToMany(() => ExhibitionMember, member => member.exhibition, { cascade: true })
    exhibitionMembers: ExhibitionMember[];

    
   
}
