import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    user_id: string;

    @Column()
    nickname: string;

    @Column()
    major: string;

    @Column()
    name: string;

    @Column()
    student_id: number;

    @Column()
    social_email: string;
}
