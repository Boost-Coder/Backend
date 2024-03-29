import {
    Column,
    Entity,
    JoinColumn,
    OneToOne,
    PrimaryGeneratedColumn,
} from 'typeorm';
import { User } from './user';

@Entity()
export class Github {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 8,
        unique: true,
    })
    userId: string;

    @Column()
    point: number;

    @Column()
    accessToken: string;

    @Column()
    refreshToken: string;

    @OneToOne(() => User, (user) => user.userId)
    @JoinColumn({ name: 'user_id', referencedColumnName: 'userId' })
    user: User;
}
