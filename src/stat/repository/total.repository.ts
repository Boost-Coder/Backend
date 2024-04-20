import { DataSource } from 'typeorm';
import { Inject } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { TotalPoint } from '../../Entity/totalPoint';
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
}
