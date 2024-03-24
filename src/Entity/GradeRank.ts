import { Column, PrimaryGeneratedColumn } from 'typeorm';

export class GradeRank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 8,
    })
    user_id: string;

    @Column('double')
    grade: number;

    @Column()
    point: number;
}
