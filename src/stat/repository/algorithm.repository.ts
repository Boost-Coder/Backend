import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { Algorithm } from '../../Entity/algorithm';
import { StatRepository } from '../../utils/stat.repository';

@Injectable()
export class AlgorithmRepository extends StatRepository {
    constructor(dataSource: DataSource) {
        super(dataSource, Algorithm);
    }

    async findOneById(userId: string) {
        return await this.findOneBy({ userId: userId });
    }

    async updateAlgorithm(userId: string, algorithm: Algorithm) {
        await this.update({ userId: userId }, algorithm);
    }

    async deleteAlgorithm(userId: string) {
        await this.delete({ userId: userId });
    }
}
