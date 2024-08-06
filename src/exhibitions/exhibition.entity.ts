import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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

}
