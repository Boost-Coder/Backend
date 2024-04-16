import { BaseRepository } from '../../utils/base.repository';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Algorithm } from '../../Entity/algorithm';
import { RankListOptionDto } from '../../rank/rank-list-option.dto';
import { User } from '../../Entity/user';

@Injectable({ scope: Scope.REQUEST })
export class AlgorithmRepository extends BaseRepository {
    private repository: Repository<Algorithm>;
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
        this.repository = this.getRepository(Algorithm);
    }

    async save(algorithm: Algorithm) {
        await this.repository.save(algorithm);
    }

    async findOneById(userId: string) {
        return await this.repository.findOneBy({ userId: userId });
    }

    async findAlgorithmWithRank(options: RankListOptionDto) {
        const queryBuilder = this.repository
            .createQueryBuilder()
            .select(['b.rank', 'b.user_id', 'b.point'])
            .distinct(true)
            .from((sub) => {
                return sub
                    .select('RANK() OVER (ORDER BY a.point DESC)', 'rank')
                    .addSelect('a.user_id', 'user_id')
                    .addSelect('a.point', 'point')
                    .from(Algorithm, 'a');
            }, 'b')
            .innerJoin(User, 'u', 'b.user_id = u.user_id')
            .addSelect('u.nickname', 'nickname')
            .where('b.point < :point', { point: options.cursorPoint })
            .orWhere('b.point = :point AND b.user_id > :userId', {
                point: options.cursorPoint,
                userId: options.cursorUserId,
            })
            .orderBy('point', 'DESC')
            .addOrderBy('user_id')
            .limit(3);

        return await queryBuilder.getRawMany();
    }

    async update(userId: string, algorithm: Algorithm) {
        await this.repository.update({ userId: userId }, algorithm);
    }

    async delete(userId: string) {
        await this.repository.delete({ userId: userId });
    }
}
