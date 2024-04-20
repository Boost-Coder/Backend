import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Algorithm } from '../../Entity/algorithm';
import { RankListOptionDto } from '../dto/rank-list-option.dto';
import { User } from '../../Entity/user';
import { PointFindDto } from '../dto/rank-find.dto';
import { StatRepository } from '../../utils/stat.repository';

@Injectable({ scope: Scope.REQUEST })
export class AlgorithmRepository extends StatRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req, Algorithm);
    }

    async save(algorithm: Algorithm) {
        await this.repository.save(algorithm);
    }

    async findOneById(userId: string) {
        return await this.repository.findOneBy({ userId: userId });
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
            .where(`b.user_id = '${userId}'`);

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
