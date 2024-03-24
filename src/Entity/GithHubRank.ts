import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class GitHubRank {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        length: 8,
    })
    user_id: string;

    @Column()
    point: number;
}
