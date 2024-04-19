import { BaseRepository } from '../../utils/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Github } from '../../Entity/github';
import { REQUEST } from '@nestjs/core';
import { Grade } from '../../Entity/grade';
import { RankListOptionDto } from '../dto/rank-list-option.dto';
import { User } from '../../Entity/user';
import { PointFindDto } from '../dto/rank-find.dto';

@Injectable()
export class GradeRepository extends BaseRepository {
    private repository: Repository<Grade>;

    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
        this.repository = this.getRepository(Grade);
    }

    public async save(grade: Grade) {
        await this.repository.save(grade);
    }

    public async findOne(id: string) {
        return await this.repository.findOneBy({ userId: id });
    }

    public async update(newGrade: Grade) {
        return await this.repository.update(
            { userId: newGrade.userId },
            {
                grade: newGrade.grade,
                point: newGrade.point,
            },
        );
    }

    public async delete(id: string) {
        await this.repository.delete({ userId: id });
    }

    public async findIndividualGradeRank(
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
}
