import {
    Column,
    CreateDateColumn,
    Entity,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { Github } from './github';
import { Algorithm } from './algorithm';
import { Grade } from './grade';
import { TotalPoint } from './totalPoint';

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
        nullable: true,
        unique: true,
    })
    nickname: string;

    @Column({
        length: 30,
        nullable: true,
    })
    major: string;

    @Column({
        length: 30,
        nullable: true,
    })
    name: string;

    @Column({ unique: true, nullable: true })
    studentId: number;

    @Column({ type: 'date', nullable: true })
    birthDate: Date;

    @Column({
        length: 320,
        unique: true,
    })
    providerId: string;

    @CreateDateColumn({
        type: 'timestamp',
        nullable: false,
    })
    createDate: Date;

    @UpdateDateColumn({
        type: 'timestamp',
        nullable: true,
    })
    updateDate: Date;

    @OneToOne(() => Github, (github) => github.user, { cascade: ['remove'] })
    github: Github;

    @OneToOne(() => Algorithm, (algorithm) => algorithm.user, {
        cascade: ['remove'],
    })
    algorithm: Algorithm;

    @OneToOne(() => Grade, (grade) => grade.user, { cascade: ['remove'] })
    grade: Grade;

    @OneToOne(() => TotalPoint, (totalPoint) => totalPoint.user, {
        cascade: ['remove'],
    })
    totalScore: TotalPoint;
}
