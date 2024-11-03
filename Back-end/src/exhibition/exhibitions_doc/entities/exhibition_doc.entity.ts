import { Entity, Column, PrimaryGeneratedColumn, ManyToOne ,JoinColumn} from 'typeorm';
import { Exhibition } from '../../exhibitions/exhibition.entity';

@Entity()
export class ExhibitionDoc {
    @PrimaryGeneratedColumn()
    exhibition_doc_id: number;

    @ManyToOne(() => Exhibition, exhibition => exhibition.exhibitionDocs, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'exhibition_id', referencedColumnName: 'exhibition_id'})
    exhibition: Exhibition;

    @Column()
    file_path: string; 

   
}
