import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { JoinColumn } from 'typeorm';
import { Github } from './github';
import { Algorithm } from './algorithm';
import { Grade } from './grade';

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

    @OneToOne(() => Github, (github) => github.userId)
    github: Github;

    @OneToOne(() => Algorithm, (algorithm) => algorithm.userId)
    algorithm: Algorithm;

    @OneToOne(() => Grade, (grade) => grade.userId)
    grade: Grade;
}
