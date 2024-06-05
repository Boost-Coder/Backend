import {
    BeforeInsert,
    BeforeUpdate,
    Column,
    CreateDateColumn,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
    UpdateDateColumn,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Grade {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 8,
        unique: true,
    })
    userId: string;

    @Column('double')
    grade: number;

    @Column('decimal', { precision: 10, scale: 2 })
    score: number;

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

    @OneToOne(() => User, (user) => user.userId, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
    user: User;

    @BeforeInsert()
    @BeforeUpdate()
    roundAmount() {
        this.score = Math.round(this.score * 100) / 100;
    }
}
