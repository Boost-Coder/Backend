import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 8,
        unique: true,
    })
    userId: string;

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

    @Column({ unique: true })
    student_id: number;

    @Column({
        length: 320,
        unique: true,
    })
    social_email: string;
}
