import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,JoinColumn} from 'typeorm';
import { Exhibition } from 'src/exhibitions/exhibition.entity';// Exhibition 엔티티 경로에 맞게 수정

@Entity('exhibition_intro')
export class ExhibitionIntro {
  @PrimaryGeneratedColumn()
  exhibition_intro_id: number;

  @ManyToOne(() => Exhibition, exhibition => exhibition.exhibitionIntros, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'exhibition_id', referencedColumnName: 'exhibition_id'})
  exhibition: Exhibition;

  @Column({ type: 'text' })
  introduce: string;
}
