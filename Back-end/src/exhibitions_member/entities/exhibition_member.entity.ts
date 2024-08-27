import { Entity, Column, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Exhibition } from 'src/exhibitions/exhibition.entity';

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

    @ManyToOne(() => Exhibition, exhibition => exhibition.exhibitionMembers) // Exhibition과의 관계 설정
    exhibition: Exhibition; // 전시 정보
}
