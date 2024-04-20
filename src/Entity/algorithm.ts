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
export class Algorithm {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 8,
        unique: true,
    })
    userId: string;

    @Column({
        length: 21,
        unique: true,
    })
    bojId: string;

    @Column()
    rating: number;

    @Column()
    tier: number;

    @Column()
    solvedCount: number;

    @Column()
    point: number;

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
