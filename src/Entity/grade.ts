import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

    @Column()
    point: number;
}
