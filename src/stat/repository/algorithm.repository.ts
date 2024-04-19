import { BaseRepository } from '../../utils/base.repository';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Algorithm } from '../../Entity/algorithm';
import { RankListDto, RankListOptionDto } from '../dto/rank-list-option.dto';
import { User } from '../../Entity/user';
import { PointFindDto } from '../dto/rank-find.dto';

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

    async findAlgorithmWithRank(
        options: RankListOptionDto,
    ): Promise<[RankListDto]> {
        const queryBuilder = this.repository
            .createQueryBuilder()
            .select(['b.rank', 'b.user_id', 'b.point', 'b.nickname'])
            .distinct(true)
            .from((sub) => {
                return sub
                    .select('RANK() OVER (ORDER BY a.point DESC)', 'rank')
                    .addSelect('a.user_id', 'user_id')
                    .addSelect('a.point', 'point')
                    .addSelect('u.nickname', 'nickname')
                    .from(Algorithm, 'a')
                    .innerJoin(User, 'u', 'a.user_id = u.user_id')
                    .where(this.createClassificationOption(options));
            }, 'b')
            .where(this.createCursorOption(options))
            .orderBy('point', 'DESC')
            .addOrderBy('user_id')
            .limit(3);
        return await (<Promise<[RankListDto]>>queryBuilder.getRawMany());
    }

    public async findIndividualAlgorithmRank(
        userId: string,
        options: PointFindDto,
    ) {
        const queryBuilder = this.repository
            .createQueryBuilder()
            .select(['b.rank', 'b.user_id', 'b.major'])
            .distinct(true)
            .from((sub) => {
                return sub
                    .select('RANK() OVER (ORDER BY a.point DESC)', 'rank')
                    .addSelect('a.user_id', 'user_id')
                    .addSelect('a.point', 'point')
                    .from(Algorithm, 'a')
                    .innerJoin(User, 'u', 'a.user_id = u.user_id')
                    .addSelect('u.major', 'major')
                    .where(this.createClassificationOption(options));
            }, 'b')
            .where(`b.user_id = ${userId}`);

        return await queryBuilder.getRawOne();
    }

    createCursorOption(options: RankListOptionDto) {
        if (!options.cursorPoint && !options.cursorUserId) {
            return 'b.point > -1';
        } else {
            return `b.point < ${options.cursorPoint} or b.point = ${options.cursorPoint} AND b.user_id > '${options.cursorUserId}'`;
        }
    }

    createClassificationOption(options: PointFindDto) {
        if (options.major != null) {
            return `u.major like '${options.major}'`;
        } else {
            return `u.id > 0`;
        }
    }

    async update(userId: string, algorithm: Algorithm) {
        await this.repository.update({ userId: userId }, algorithm);
    }

    async delete(userId: string) {
        await this.repository.delete({ userId: userId });
    }
}
