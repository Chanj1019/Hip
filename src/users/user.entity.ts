import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../enums/role.enum';
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    user_id: number;

    @Column()
    user_name: string;

    @Column()
    id: string;

    @Column()
    password: string;
    
    @Column()
    email: string;

    @Column()
    term: string;

    @Column()
    nick_name: string;

    @Column({
        type: 'enum',
        enum: Role, // Role enum 사용
    })
    user_role: Role; // Role 타입으로 변경
}
