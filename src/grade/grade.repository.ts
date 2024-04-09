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

    public async delete(id: string) {}
}
