import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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
}
