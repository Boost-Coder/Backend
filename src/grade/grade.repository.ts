import { BaseRepository } from '../utils/base.repository';
import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { Github } from '../Entity/github';
import { REQUEST } from '@nestjs/core';
import { Grade } from '../Entity/grade';

@Injectable()
export class GradeRepository extends BaseRepository {
    private repository: Repository<Grade>;

    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req);
    }

    public async save(grade: Grade) {
        await this.repository.save(grade);
    }

    public async findOne(id: string) {
        return await this.repository.findOneBy({ userId: id });
    }

    public async update(github: Github) {}

    public async delete(id: string) {}
}
