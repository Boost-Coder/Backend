import { BaseRepository } from './base.repository';
import { DataSource, Repository } from 'typeorm';
import { Algorithm } from '../Entity/algorithm';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import {
    RankListDto,
    RankListOptionDto,
} from '../stat/dto/rank-list-option.dto';
import { User } from '../Entity/user';
import { PointFindDto } from '../stat/dto/rank-find.dto';

export class StatRepository extends BaseRepository {
    protected repository: Repository<any>;
    private entity;
    constructor(dataSource: DataSource, req: Request, entity) {
        super(dataSource, req);
        this.repository = this.getRepository(entity);
        this.entity = entity;
    }

    async findWithRank(options: RankListOptionDto): Promise<[RankListDto]> {
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
                    .from(this.entity, 'a')
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

    createClassificationOption(options: PointFindDto) {
        if (options.major != null) {
            return `u.major like '${options.major}'`;
        } else {
            return `u.id > 0`;
        }
    }
}
