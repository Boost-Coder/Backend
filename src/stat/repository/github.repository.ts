import { BaseRepository } from '../../utils/base.repository';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { Github } from '../../Entity/github';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { RankListDto, RankListOptionDto } from '../dto/rank-list-option.dto';
import { Algorithm } from '../../Entity/algorithm';
import { User } from '../../Entity/user';
import { PointFindDto } from '../dto/rank-find.dto';

@Injectable()
export class GithubRepository extends BaseRepository {
    private repository: Repository<Github>;

    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
        this.repository = this.getRepository(Github);
    }

    public async save(github: Github) {
        await this.repository.save(github);
    }

    public async findOne(id: string) {
        return await this.repository.findOneBy({ userId: id });
    }

    public async update(github: Github) {
        return await this.repository.update(
            { userId: github.userId },
            {
                githubId: github.githubId,
                accessToken: github.accessToken,
                point: github.point,
            },
        );
    }

    public async delete(id: string) {
        await this.repository.delete({ userId: id });
    }

    public async findAll() {
        return await this.repository.find();
    }

    public async findIndividualGithubRank(
        userId: string,
        options: PointFindDto,
    ) {
        const queryBuilder = this.repository
            .createQueryBuilder()
            .select(['b.rank', 'b.user_id'])
            .distinct(true)
            .from((sub) => {
                return sub
                    .select('RANK() OVER (ORDER BY g.point DESC)', 'rank')
                    .addSelect('g.user_id', 'user_id')
                    .addSelect('g.point', 'point')
                    .from(Github, 'g')
                    .innerJoin(User, 'u', 'g.user_id = u.user_id')
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

    async findGithubWithRank(
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
                    .from(Github, 'a')
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
