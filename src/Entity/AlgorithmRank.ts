import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class AlgorithmRank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 8,
    })
    user_id: string;

    @Column({
        length: 21,
    })
    boj_id: string;

    @Column({
        length: 5,
    })
    boj_score: number;

    @Column()
    point: number;
}
