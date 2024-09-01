import { Entity, Column, ManyToOne, PrimaryGeneratedColumn,JoinColumn } from 'typeorm';
import { Exhibition } from '../../exhibitions/exhibition.entity';

@Entity()
export class ExhibitionMember {
    @PrimaryGeneratedColumn()
    exhibition_member_id: number;

    @Column()
    name: string;

    @Column({ nullable: true })
    nick_name?: string;

    @Column()
    generation: string;

    @Column()
    file_path: string;

    @ManyToOne(() => Exhibition, exhibition => exhibition.exhibitionMembers, { onDelete: 'CASCADE' }) // Exhibition과의 관계 설정
    @JoinColumn({ name: 'exhibition_id', referencedColumnName: 'exhibition_id'})
    exhibition: Exhibition; // 전시 정보
}
