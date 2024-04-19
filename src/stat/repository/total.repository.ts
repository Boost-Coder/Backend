import { DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TotalPoint } from '../../Entity/totalPoint';
import { Algorithm } from '../../Entity/algorithm';
import { User } from '../../Entity/user';
import { PointFindDto } from '../dto/rank-find.dto';
import { StatRepository } from '../../utils/stat.repository';

export class TotalRepository extends StatRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req, TotalPoint);
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
}
