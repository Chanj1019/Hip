import { Entity, Column, PrimaryGeneratedColumn, ManyToOne,JoinColumn} from 'typeorm';
import { Exhibition } from '../../exhibitions/exhibition.entity';

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
