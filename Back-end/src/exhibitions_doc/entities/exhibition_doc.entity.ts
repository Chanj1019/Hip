import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Exhibition } from 'src/exhibitions/exhibition.entity'; // Exhibition 엔티티 경로에 맞게 수정

@Entity()
export class ExhibitionDoc {
    @PrimaryGeneratedColumn()
    exhibition_doc_id: number; // 기본 키

    @ManyToOne(() => Exhibition, exhibition => exhibition.exhibitionDocs) // Exhibition과의 관계 설정
    exhibition: Exhibition; // 외래키

    @Column()
    file_path: string; // 파일 경로

    @Column({ nullable: true }) // 피드백은 선택 사항으로 설정
    feedback: string; // 피드백
}
