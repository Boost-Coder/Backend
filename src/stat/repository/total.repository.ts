import { DataSource } from 'typeorm';
import { TotalPoint } from '../../Entity/totalPoint';
import { StatRepository } from '../../utils/stat.repository';
import { Injectable } from '@nestjs/common';

@Injectable()
export class TotalRepository extends StatRepository {
    constructor(private dataSource: DataSource) {
        super(dataSource, TotalPoint);
    }

    async findOneById(userId: string) {
        return await this.findOneBy({ userId: userId });
    }

    async updateTotal(total: TotalPoint, userId: string) {
        return await this.update({ userId: userId }, total);
    }
}
