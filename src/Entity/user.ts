import {
    Column,
    CreateDateColumn,
    DeleteDateColumn,
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
    studentId: number;

    @Column({
        length: 320,
        unique: true,
    })
    socialEmail: string;

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

    @DeleteDateColumn()
    deleteDate: Date;

    @OneToOne(() => Github, (github) => github.userId)
    github: Github;

    @OneToOne(() => Algorithm, (algorithm) => algorithm.userId)
    algorithm: Algorithm;

    @OneToOne(() => Grade, (grade) => grade.userId)
    grade: Grade;

    @OneToOne(() => TotalPoint, (totalPoint) => totalPoint.userId)
    totalScore: TotalPoint;
}