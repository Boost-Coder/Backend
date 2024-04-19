import { Inject, Injectable } from '@nestjs/common';
import { Github } from '../../Entity/github';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { User } from '../../Entity/user';
import { PointFindDto } from '../dto/rank-find.dto';
import { StatRepository } from '../../utils/stat.repository';

@Injectable()
export class GithubRepository extends StatRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req, Github);
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
}
