import { BaseRepository } from '../utils/base.repository';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Algorithm } from '../Entity/algorithm';

@Injectable({ scope: Scope.REQUEST })
export class AlgorithmRepository extends BaseRepository {
    private repository: Repository<Algorithm>;
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
        this.repository = this.getRepository(Algorithm);
    }

    async save(algorithm: Algorithm) {
        await this.repository.save(algorithm);
    }
}
