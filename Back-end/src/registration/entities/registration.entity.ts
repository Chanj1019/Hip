import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

export enum Status {
    Pending = 'PENDING',
    Approved = 'APPROVED',
    Rejected = 'REJECTED'
}

@Entity()
export class Registration {
    @PrimaryGeneratedColumn()
    registration_id: number;

    @Column()
    status: Status;

    @Column()
    personnel: number;
}
