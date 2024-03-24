import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 8,
    })
    user_id: string;

    @Column({
        length: 30,
    })
    nickname: string;

    @Column({
        length: 30,
    })
    major: string;

    @Column({
        length: 30,
    })
    name: string;

    @Column({
        length: 10,
    })
    student_id: number;

    @Column({
        length: 320,
    })
    social_email: string;
}
