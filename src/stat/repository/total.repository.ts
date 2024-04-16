import { BaseRepository } from '../../utils/base.repository';
import { DataSource, Repository } from 'typeorm';
import { Grade } from '../../Entity/grade';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TotalPoint } from '../../Entity/totalPoint';

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
}
