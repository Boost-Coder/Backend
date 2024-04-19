import { Inject, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { REQUEST } from '@nestjs/core';
import { Grade } from '../../Entity/grade';
import { StatRepository } from '../../utils/stat.repository';

@Injectable()
export class GradeRepository extends StatRepository {
    constructor(dataSource: DataSource, @Inject(REQUEST) req: Request) {
        super(dataSource, req, Grade);
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
}
