import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exhibition } from 'src/exhibitions/exhibition.entity'; // Exhibition 엔티티 경로에 맞게 수정

@Entity()
export class ExhibitionsMember {
    @PrimaryGeneratedColumn() // 자동 증가 주 키
    exhibition_member_id: number; // 주 키

    @ManyToOne(() => Exhibition, exhibition => exhibition.exhibitionsMembers) // Exhibition과의 관계 설정
    exhibitions: Exhibition; // 외래 키

    @Column()
    name: string; // 이름

    @Column({ nullable: true }) // 닉네임은 선택적이므로 nullable 설정
    nick_name?: string; // 닉네임

    @Column()
    generation: string; // 기수
}
