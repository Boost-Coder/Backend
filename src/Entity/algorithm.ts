import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
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
    bojScore: number;

    @Column()
    point: number;

    @OneToOne(() => User, (user) => user.userId)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
    user: User;
}
