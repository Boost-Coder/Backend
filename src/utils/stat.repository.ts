import { DataSource, Repository } from 'typeorm';
import {
    RankListDto,
    RankListOptionDto,
} from '../stat/dto/rank-list-option.dto';
import { User } from '../Entity/user';
import { PointFindDto } from '../stat/dto/rank-find.dto';

export class StatRepository extends Repository<any> {
    private entity;
    constructor(dataSource: DataSource, entity) {
        super(entity, dataSource.createEntityManager());
        this.entity = entity;
    }

    async findWithRank(options: RankListOptionDto): Promise<[RankListDto]> {
        const queryBuilder = this.createQueryBuilder()
            .select(['b.rank', 'b.score', 'b.nickname'])
            .addSelect('b.user_id', 'userId')
            .distinct(true)
            .from((sub) => {
                return sub
                    .select('RANK() OVER (ORDER BY a.score DESC)', 'rank')
                    .addSelect('a.user_id', 'user_id')
                    .addSelect('a.score', 'score')
                    .addSelect('u.nickname', 'nickname')
                    .from(this.entity, 'a')
                    .innerJoin(User, 'u', 'a.user_id = u.user_id')
                    .where(this.createClassificationOption(options));
            }, 'b')
            .where(this.createCursorOption(options))
            .orderBy('score', 'DESC')
            .addOrderBy('userId')
            .limit(3);
        const result = await (<Promise<[RankListDto]>>(
            queryBuilder.getRawMany()
        ));
        result.forEach(
            (result) => (result.rank = parseInt(String(result.rank), 10)),
        );

        return result;
    }

    public async findIndividualRank(userId: string, options: PointFindDto) {
        const queryBuilder = this.createQueryBuilder()
            .select(['b.rank', 'b.user_id'])
            .distinct(true)
            .from((sub) => {
                return sub
                    .select('RANK() OVER (ORDER BY a.score DESC)', 'rank')
                    .addSelect('a.user_id', 'user_id')
                    .from(this.entity, 'a')
                    .innerJoin(User, 'u', 'a.user_id = u.user_id')
                    .addSelect('u.major', 'major')
                    .where(this.createClassificationOption(options));
            }, 'b')
            .where(`b.user_id = '${userId}'`);

        return await queryBuilder.getRawOne();
    }
    createCursorOption(options: RankListOptionDto) {
        if (!options.cursorPoint && !options.cursorUserId) {
            return 'b.score > -1';
        } else {
            return `b.score < ${options.cursorPoint} or b.score = ${options.cursorPoint} AND b.user_id > '${options.cursorUserId}'`;
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
