import {
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

    @Column('double')
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
}
