import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
