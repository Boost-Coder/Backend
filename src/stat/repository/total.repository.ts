import { BaseRepository } from '../../utils/base.repository';
import { DataSource, Repository } from 'typeorm';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TotalPoint } from '../../Entity/totalPoint';
import { RankListDto, RankListOptionDto } from '../dto/rank-list-option.dto';
import { Algorithm } from '../../Entity/algorithm';
import { User } from '../../Entity/user';
import { PointFindDto } from '../dto/rank-find.dto';

export class TotalRepository extends BaseRepository {
    private repository: Repository<TotalPoint>;

    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
        this.repository = this.getRepository(TotalPoint);
    }

    async findOneById(userId: string) {
        return await this.repository.findOneBy({ userId: userId });
    }

    async update(total: TotalPoint, userId: string) {
        return await this.repository.update({ userId: userId }, total);
    }

    async save(total: TotalPoint) {
        return await this.repository.save(total);
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

    createClassificationOption(options: PointFindDto) {
        if (options.major != null) {
            return `u.major like '${options.major}'`;
        } else {
            return `u.id > 0`;
        }
    }

    async findTotalWithRank(
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
                    .from(TotalPoint, 'a')
                    .innerJoin(User, 'u', 'a.user_id = u.user_id')
                    .where(this.createClassificationOption(options));
            }, 'b')
            .where(this.createCursorOption(options))
            .orderBy('point', 'DESC')
            .addOrderBy('user_id')
            .limit(3);
        return await (<Promise<[RankListDto]>>queryBuilder.getRawMany());
    }

    createCursorOption(options: RankListOptionDto) {
        if (!options.cursorPoint && !options.cursorUserId) {
            return 'b.point > -1';
        } else {
            return `b.point < ${options.cursorPoint} or b.point = ${options.cursorPoint} AND b.user_id > '${options.cursorUserId}'`;
        }
    }
}
